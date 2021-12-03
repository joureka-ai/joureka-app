from typing import Any, Optional

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from app import models, crud, schemas
from app.api import deps
from jouresearch_nlp.wordcloud.frequency import calculate_freq_over_docs
from .helper import check_doc_in_docs, calcuate_frequencies, transform_word_freqs
import logging

router = APIRouter()

LOG = logging.getLogger(__name__)

@router.get('/{project_id}/wordcloud/')
def generate_frequencies(
    project_id: int,
    word_threshold: int,
    document_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.WordFrequencies:
    """
    Generate the frequencies of words for creating a WordCloud in either a single document or in all of the documents of a project.
    - Args: Project ID, the number of words to display in the wordcloud and the OPTIONAL document ID
    - Returns: The words with frequency and corresponding documents.
    """
    if document_id:
        documents = [crud.document.get_by_p_id(db, document_id, project_id)]
    
    if not document_id:
        documents = crud.document.get_all_by_p_id(db, project_id)

    if not documents:
        raise HTTPException(
            status_code=404, detail="There are no documents existing for this project."
        )

    docs = []
    for document in documents:
        doc = {"text": document.fulltext,
        "id": document.id}
        docs.append(doc)

    freq_list = calculate_freq_over_docs(docs=docs, wc_threshold=word_threshold)

    return transform_word_freqs(freq_list)

@router.get('/{project_id}/pinplot/')
def get_frequencies(
    project_id: int,
    document_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.PinFrequencies:
    """
    Generate the frequencies pins in either a single document or in all of the documents of a project.
    - Args: Project ID and the OPTIONAL document ID
    - Returns: The pins with frequency and corresponding document.
    """

    if document_id:
        pins = crud.annot.get_by_d_type(db, document_id, type="Pin")
    
    if not document_id:
        # Get all pins in the database
        pins = crud.annot.get_all_by_type(db, type="Pin")

        LOG.info(pins)
        # get all documents of a project
        docs = crud.document.get_all_by_p_id(db, project_id)
        doc_ids = [doc.id for doc in docs]
        
        # Make sure to only take pins that are in the project
        pins = [pin for pin in pins if check_doc_in_docs(doc_ids, pin.fk_document)]

    if not pins:
        raise HTTPException(
            status_code=404, detail="There are no pins for this document or the document is not in the given project."
        )

    return calcuate_frequencies(pins)