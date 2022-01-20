from typing import List, Optional
from datetime import timedelta
import logging

from app.crud.base import CRUDBase
from app.models import Word
from app.schemas.word import EditedWordMeta

from sqlalchemy.orm import Session
from sqlalchemy.sql import exists

from spacy.tokens import Doc, Token

LOG = logging.getLogger(__name__)

def create_version_no(word: Word) -> int:
    """ Increment the edit_version_no attribute for a incoming word that is to be created.
    """
    if word.edit_version_no is None:
        version_no = 0
    if word.edit_version_no is not None:
        version_no = word.edit_version_no + 1
    return version_no

def get_start_time(words: List[Word], pos) -> int:
    """ Get the start time from an existing word in the list of words that are choosen to be altered.
    If the word at the given position has no value, the predecessor is taken until a value is found. 
    """
    tmp_start_time = words[pos].start_time
    c = 1
    while tmp_start_time is None:
        tmp_start_time = words[pos-c].end_time
        c += 1

    return tmp_start_time

def get_end_time(words: List[Word], pos) -> int:
    """ Get the end time from an existing word in the list of words that are choosen to be altered.
    If the word at the given position has no value, the successor is taken until a value is found. 
    """
    tmp_end_time = words[pos].end_time
    c = 1
    while tmp_end_time is None:
        tmp_end_time = words[pos+c].start_time
        c += 1

    return tmp_end_time

def _create_word(words: List[Word],
    word: Optional[Word],
    token_in: Doc,
    pos: int,
    word_in_meta: EditedWordMeta,
    start_time: Optional[timedelta],
    end_time: Optional[timedelta]
    ) -> Word:
    """Create a word object based on different scenarios
    """

    word_in = Word(
        word=token_in.text,
        confidence=1.0, 
        edited=True)
    if word:
        # for changing existing words
        word_in.initial_order = word.initial_order
        word_in.current_order = word.current_order
        word_in.fk_document = word.fk_document
        # increment version no
        word_in.edit_version_no=create_version_no(word)
    
    if start_time and end_time:    
        word_in.start_time = start_time
        word_in.end_time = end_time

    if not word:
        # for adding new words 
        word_in.initial_order = word_in_meta.initial_order
        word_in.current_order = word_in_meta.current_order
        word_in.fk_document = word_in_meta.fk_document
    
    if token_in.is_punct:
        # overwrite attributes on existing object
        word_in.start_time=None
        word_in.end_time=None
        word_in.confidence=None

    if not token_in.is_punct:
        if  word_in.start_time is None and word_in.end_time is None:
            word_in.start_time=get_start_time(words=words, pos=pos)
            word_in.end_time=get_end_time(words=words, pos=pos)

    return word_in

def update_word_order(words: List[Word], diff_len: int, update_order_no: int):
    """Update the attribute of a word (current_order) on the given list of existing word objects. Two scenarios
    are respected, first for cases where the user deletes existing words. 
    """
    words = [word for word in words if isinstance(word.current_order, int) ]
    if diff_len > 0:
        # user deletes existing words
        pos_update = update_order_no - diff_len
        words_to_update = [word for word in words if word.current_order > pos_update]
        for word in words_to_update:
            # Move succesing words forward in order
            word.current_order -= diff_len
    else:
        # user adds new words
        words_to_update = [word for word in words if word.current_order > update_order_no]
        for word in words_to_update:
            # Move successing words backwards in order
            word.current_order += -diff_len


def change_words(words: List[Word], tokens_in: Doc) -> List[Word]:
    """ The function iterates over all words in the given list of words and compares it with the list of incoming words (tokens_in). 
    Only an existing word is changed when the incoming word (in the same position) is not the same. The change is handled by creating a new word and removing 
    the old word from the current_order.
    """
    tmp_words_in = []
    for i, word in enumerate(words):
        token_in = tokens_in[i]
        if word.word != token_in.text:
        # incoming word does not exist
            tmp_word_in = _create_word(words, word, token_in, i, None, None, None)
            word.current_order = None

            tmp_words_in.append(tmp_word_in)    

    return tmp_words_in

def delete_words(words: List[Word], tokens_in: Doc) -> List[Word]:
    """The function iterates over all existing words in the given list and creates new words where a change was done.
    All the words the user wants to delete are "deleted" by setting the current_order attribute to None.
    """
    tmp_words_in = []
    for i, word in enumerate(words):
        try:
        # There are more existing words than incoming words
            token_in = tokens_in[i]
        except:
            token_in = None

        if isinstance(token_in, Token):
        # Compare existing and incoming words and create incoming words correspondingly
            if word.word != token_in.text:
                tmp_word_in = _create_word(words, word, token_in, i, None, None, None)
                word.current_order = None

                tmp_words_in.append(tmp_word_in)
                
        elif token_in is None:
            # Delete the words from words that are "longer" than tokens_in.
            word.current_order = None            

    return tmp_words_in 

def add_words(words: List[Word], tokens_in: Doc) -> List[Word]:
    """The function iterates over all incoming words and compares existing word and incoming word (token). 
    Once there is no existing word for a incoming word anymore, new words are created by accessing stored metadata of the last existing word.
    """
    tmp_words_in = []
    # Store details for new words that need to be added
    word_in_meta = EditedWordMeta(fk_document=words[0].fk_document)

    for i, token_in in enumerate(tokens_in):
        try:
        # There are more incoming words than existing words
            word = words[i]
            
            num_added_words = len(tokens_in) - len(words) + 1
            word_in_meta.current_order = word.current_order + 1
            word_in_meta.initial_order = word.initial_order
            tmp_start_time = get_start_time(words, i)
            tmp_end_time = get_end_time(words, i)
            # we want to split the time of the last word that exists and the newly added words
            timeframe = (tmp_end_time - tmp_start_time) / num_added_words
            assert timeframe

        except Exception as e:
        # No existing words anymore set word to None
            #LOG.info(e)
            word = None

        if isinstance(word, Word):
        # Compare existing and incoming words and create incoming words correspondingly
            if word.word != token_in.text:
                if i != len(words)-1:
                    tmp_word_in = _create_word(words, word, token_in, i, None, None, None)
                if i == len(words)-1:
                    # Calculate and update the timeframe for the last word of the existing words
                    tmp_end_time = tmp_start_time + timeframe
                    tmp_word_in = _create_word(words, word, token_in, i, None, tmp_start_time, tmp_end_time)
                    tmp_start_time = tmp_end_time

                word.current_order = None

                tmp_words_in.append(tmp_word_in)

            if i == len(words)-1:
                if word.word == token_in.text:
                    # Change the timeframe of the last existing word that should remain the same.
                    # We do this by creating a copy of the existing word  and changing the time.
                    # All following words will need to fit in the original timeframe of the last existing word.
                    tmp_end_time = tmp_start_time + timeframe
                    tmp_word_in = _create_word(words, word, token_in, i, None, tmp_start_time, tmp_end_time)
                    tmp_start_time = tmp_end_time

                word.current_order = None

                tmp_words_in.append(tmp_word_in)

        elif word is None:
        # New words are create with the stored word metadata
            tmp_end_time = tmp_start_time + timeframe 
            # Add the tokens as words that are not existing
            tmp_word_in = _create_word(words, None, token_in, i, word_in_meta, tmp_start_time, tmp_end_time)                  
            tmp_start_time = tmp_end_time
            
            word_in_meta.current_order += 1

            tmp_words_in.append(tmp_word_in)

    return tmp_words_in
