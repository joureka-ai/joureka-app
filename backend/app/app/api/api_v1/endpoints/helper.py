from typing import Any, Optional, List
import logging

LOG = logging.getLogger(__name__)

from sqlalchemy.orm import Session

from app import crud
from app.models.annot import Annot
from app.schemas import AnnotFrequencies, AnnotFreq, WordFrequencies, WordFreq
from app.schemas import Document

def check_doc_in_docs(doc_ids: List[int], annot_doc_id: int) -> bool:
    #LOG.info(annot_doc_id)
    return annot_doc_id in doc_ids


def calcuate_frequencies(annots: List[Annot]) -> AnnotFrequencies:
    freq_dict = {}
    
    for annot in annots:
        if not annot.label in freq_dict.keys():
            freq_dict[annot.label] = {}

        freq = freq_dict[annot.label].get("frequency", 0)
        freq_dict[annot.label]["frequency"] = freq + 1
        
        if not "recordings" in freq_dict[annot.label].keys():
            freq_dict[annot.label]["recordings"] = []

        if not annot.fk_document in freq_dict[annot.label]["recordings"]:
            freq_dict[annot.label]["recordings"].append(annot.fk_document)

    pin_freqs = []
    for key in freq_dict:
        pin_freq = AnnotFreq(name=key,
                        frequency=freq_dict[key]["frequency"],
                        recordings=freq_dict[key]["recordings"])
        pin_freqs.append(pin_freq)

    return AnnotFrequencies(annots=pin_freqs)

def gather_annots_by_type(db: Session, project_id: int, type: str, document_id: Optional[int] = None):
    """ To be used with the get frequencies endpoints for Pins and Topics!
    """

    if document_id:
        annots = crud.annot.get_by_d_type(db, document_id, type=type)
        if annots:
            if annots[0].fk_document != project_id:
                annots = []

    if not document_id:
        # Get all pins / topics in the database
        annots = crud.annot.get_all_by_type(db, type=type)

        #LOG.info(annots)
        # get all documents of a project
        docs = crud.document.get_all_by_p_id(db, project_id)
        doc_ids = [doc.id for doc in docs]
        
        # Make sure to only take pins / topics that are in the project
        annots = [annot for annot in annots if check_doc_in_docs(doc_ids, annot.fk_document)]

    return annots

def transform_word_freqs(freq_list: List) -> WordFrequencies:

    word_freqs = []
    for freq in freq_list:
        word_freq = WordFreq(word=freq["word"],
                        frequency=freq["frequency"],
                        recordings=freq["doc_id"])
        word_freqs.append(word_freq)

    return WordFrequencies(words=word_freqs)

def gather_fulltext_for_tm(documents: List[Document]):
    """ Gather the fulltext from documents, calculate the number of documents and provide a flag if the 
    number of documents was artificially increased or not.
    """

    docs = []
    for document in documents:
        if document.fulltext:
            doc = document.fulltext
            docs.append(doc)
        
    numd = len(docs)

    # Flag for artifically increased
    artif_increased = "N"
    if numd < 100:
        # If there are less than 100 documents duplicate the documents.
        while numd < 100:
            docs.extend(docs)
            numd = len(docs)
        artif_increased = "Y"
    
    return docs, numd, artif_increased
