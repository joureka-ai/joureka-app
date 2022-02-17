from typing import Any, Dict, Optional, List

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from pathlib import Path

from datetime import timedelta

from fastapi import UploadFile, HTTPException

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.document import Document
from app.models.word import Word
from app.models.transcript import Transcription
from app import file_storage
from app.schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    FilteredDocument,
    Headline,
    HeadlineToken,
)
from app.schemas.transcription import TranscriptionResults

from .crud_word import add_words, delete_words, change_words, update_word_order

from logging import getLogger

LOG = getLogger(__name__)

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def get_by_p_id(
        self, db: Session, id: int, fk_project: int
    ) -> Optional[Document]:
        return (
            db.query(self.model)
            .filter(self.model.fk_project == fk_project)
            .filter(self.model.id == id)
            .first()
        )
    
    def get_all_by_p_id(
        self, db: Session, fk_project: int
        ) -> List[Document]:
        return (
            db.query(self.model)
            .filter(self.model.fk_project == fk_project)
            .all()
        )

    def get_multi_by_p_id(
        self, db: Session, skip: int, limit: int, fk_project: int
    ) -> List[Document]:
        return (
            db.query(self.model)
            .filter(self.model.fk_project == fk_project)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def remove_by_p_id(
        self, db: Session, id: int, fk_project: int
    ) -> Any:
        obj = (
            db.query(self.model)
            .filter(self.model.fk_project == fk_project)
            .filter(self.model.id == id)
            .first()
        )
        db.delete(obj)
        db.commit()
        return obj 

    def filter_document(
        self, db: Session, *, filter_str: str, skip: int = 0, limit: int = 100
    ) -> List[FilteredDocument]:

        # construct the query operand for the full test search. Use
        # the regconfig of the table column. We need to cast it to
        # regconfig, which seems to not be possible in sqlalchemy, so
        # construct the term as text.
        ts_query = func.websearch_to_tsquery(
            text("fulltext_regconfig::regconfig"), filter_str
        )

        start_sel = "<"
        stop_sel = ">"
        fragment_delimiter = "|"

        res = (
            db.query(
                Document,
                func.ts_headline(
                    text("fulltext_regconfig::regconfig"),
                    Document.fulltext,
                    ts_query,
                    f"MaxFragments=10, "
                    f"minWords=4, "
                    f"maxWords=8, "
                    f"StartSel = {start_sel}, "
                    f"StopSel = {stop_sel}, "
                    f"FragmentDelimiter={fragment_delimiter}",
                ),
            )
            .filter(Document.fulltext_search_vector.op("@@")(ts_query))
            .offset(skip)
            .limit(limit)
            .all()
        )

        retval = []
        for result in res:

            document = result[0]
            headlines_raw = result[1].split(fragment_delimiter)

            headlines = []
            for hl in headlines_raw:
                remaining = hl
                tokens = []
                while start_sel in remaining:
                    token, _, remaining = remaining.partition(start_sel)
                    if token:
                        tokens.append(HeadlineToken(text=token, match=False))
                    token, _, remaining = remaining.partition(stop_sel)
                    assert token
                    tokens.append(HeadlineToken(text=token, match=True))

                if remaining:
                    tokens.append(HeadlineToken(text=remaining, match=False))

                headlines.append(Headline(tokens=tokens))

            retval.append(FilteredDocument(document=document, headlines=headlines))

        return retval

    async def create_audio_file(self, db: Session, document: Document, file: UploadFile, suffix: str) -> None:
        """
        Get a hash as a file_key. Upload the file to MINIO S3 and store with file_key and suffix.
        Store the path under document.audio_file_key
        """
        file_key = await file_storage.get_hash(file)
        file_key = f"file/{file_key}{suffix}"

        audio_file_key = await file_storage.upload_to_bucket_async(file_key, file)

        document.audio_file_key = audio_file_key

        db.commit()

    @staticmethod
    def update_fulltext(db: Session, document: Document, fulltext: Any) -> Document:
        if isinstance(fulltext[0], Word):
            fulltext = [word.word for word in fulltext]
        if isinstance(fulltext, list):
            fulltext = " ".join(fulltext)
        document.fulltext = fulltext
        document.fulltext_search_vector = func.to_tsvector(
        document.fulltext_regconfig, fulltext
        )
        db.commit()
        db.refresh(document)
    
    @staticmethod
    def update_task_id(db: Session, document: Document, task_id: str) -> Document:
        document.task_id = task_id
        db.commit()
        db.refresh(document)

    @staticmethod
    def update_transcription(db: Session, document: Document, job_raw: TranscriptionResults) -> Document:
        document.transcription = Transcription(
            raw=job_raw,
            full_text=job_raw["results"]["transcripts"][0]["transcript"])

        db.commit()
        db.refresh(document)

    @staticmethod
    def update_words(db: Session, document: Document, job_raw: TranscriptionResults) -> Document:
        
        document.words = []

        for i, item in enumerate(job_raw["results"]["items"]):
            #TODO: add punctuation
            alternative = item["alternatives"][0]
            assert "start_time" in item, item
            word = Word(
                word=alternative["content"],
                initial_order=i,
                current_order=i,
                start_time=timedelta(seconds=float(item["start_time"])),
                end_time=timedelta(seconds=float(item["end_time"])),
                confidence=float(alternative["confidence"]),
            )
            document.words.append(word)
        db.commit()
        db.refresh(document)

    def edit_words(self, db: Session, document: Document, tokens_in: List[str], start_time: float, end_time: float
    ) -> Document:

        # exclude words that are not in current_order, exclude punctuation
        # get all words that are in the timeframe
        words = [word for word in document.words if isinstance(word.current_order, int)] 
        tmp_words = [word for word in words if isinstance(word.start_time, timedelta) and isinstance(word.end_time, timedelta)] 
        timeframe_words = [word for word in tmp_words if word.start_time >= start_time and word.end_time <= end_time]
        assert timeframe_words

        #Order of 1. word and last word in timeframe
        start_order_no = int(timeframe_words[0].current_order)
        end_order_no = int(timeframe_words[-1].current_order)
        assert start_order_no >= 0
        assert end_order_no >= 0
        
        # get all words - including punctuation - that are in the timeframe
        ordered_words = [word for word in words if word.current_order >= start_order_no and word.current_order <= end_order_no]
        ordered_words = sorted(ordered_words, key=lambda w: w.current_order)
        assert ordered_words


        diff_len = len(ordered_words) - len(tokens_in)   
        LOG.info(f"The difference between existing and incoming words:") 
        LOG.info(f"# Existings words - # incomings words = {diff_len}") 
        if diff_len == 0:
            LOG.info("Only changing words not deleting or adding")
            words_in = change_words(ordered_words, tokens_in)
            if not words_in and tokens_in:
                # If no new words are created and we received tokens,
                # all text is the same as in the database.
                raise HTTPException(
                    status_code=409,
                    detail="No change could be made as the text is already existing as provided.",
                )

        elif diff_len > 0 or not tokens_in:
            LOG.info("Deleting and changing words")
            words_in = delete_words(ordered_words, tokens_in)        
            update_word_order(document.words, diff_len, end_order_no)
            if not words_in:
                LOG.info("No Words were changed, only deleted")

        elif diff_len < 0:
            LOG.info("Adding and changing words")
            words_in = add_words(ordered_words, tokens_in)
            update_word_order(document.words, diff_len, end_order_no)
            if not words_in:
                LOG.info("WARNING: No Words were added or changed. This is unexpected behaviour!")

        if words_in:
            document.words.extend(words_in)
        
        document.edited = True
        db.commit()
        db.refresh(document)
        return document

document = CRUDDocument(Document)
