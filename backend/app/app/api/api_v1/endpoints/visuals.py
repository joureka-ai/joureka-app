from typing import Any, Optional

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from app import models, crud, schemas
from app.api import deps
from jouresearch_nlp.wordcloud.frequency import calculate_freq_over_docs
from jouresearch_nlp.topicmodelling.representation import generate_topics
from jouresearch_nlp.topicmodelling.load import load_model, check_modelpath
from .helper import calcuate_frequencies, transform_word_freqs, gather_annots_by_type
import logging
from app.core.config import settings

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
def get_pin_frequencies(
    project_id: int,
    document_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.AnnotFrequencies:
    """
    Generate the frequencies pins in either a single document or in all of the documents of a project.
    - Args: Project ID and the OPTIONAL document ID
    - Returns: The pins with frequency and corresponding document.
    """

    pins = gather_annots_by_type(db, project_id, "Pin", document_id)
    
    if not pins:
        raise HTTPException(
            status_code=404, detail="There are no pins for this document or the document is not in the given project."
        )

    return calcuate_frequencies(pins)

@router.get('/{project_id}/topicplot/')
def get_topic_frequencies(
    project_id: int,
    document_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.AnnotFrequencies:
    """
    Generate the frequencies topics in either a single document or in all of the documents of a project.
    - Args: Project ID and the OPTIONAL document ID
    - Returns: The topics with frequency and corresponding document.
    """

    topics = gather_annots_by_type(db, project_id, "Topic", document_id)
    
    if not topics:
        raise HTTPException(
            status_code=404, detail="There are no Topics for this document or the document is not in the given project."
        )

    return calcuate_frequencies(topics)


@router.get('/{project_id}/topicmodel/')
def get_modelled_topics(
    project_id: int,
    top_n_words: Optional[int] = 3,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.Topics:
    """
    Generate topics for a project via unsupervised Topic Modeling. 
    The parameter top_n_words defines with how many words a topic should be described.
    - Args: Project ID and top_n_words
    - Returns: The Topics described by X, Y, size and words.
    """

    documents = crud.document.get_all_by_p_id(db, project_id)

    if not documents:
        raise HTTPException(
            status_code=404, detail="There are no documents existing for this project."
        )

    docs = []
    for document in documents:
        if document.fulltext:
            doc = document.fulltext
            docs.append(doc)
        
    numd = len(docs)

    LOG.info(f"There are with {numd} documents too few documents for unsupervised Topic Modeling!")
    LOG.info(f"To overcome this limitation, the existing documents will be artificially increased by copying.")
    art_increased = "N"
    if numd < 100:
        while numd < 100:
            docs.extend(docs)
            numd = len(docs)
        art_increased = "Y"
    
    # construct unique model name wrt to project_id and numbers of documents
    model_name = f"bertopic_pid{project_id}_numd{numd}_tnw{top_n_words}_enh{art_increased}"
    model_path = f"{settings.NLP_MODEL_DIR}topicmodel/{model_name}"
    
    return  generate_topics(docs, top_n_words=top_n_words, 
                        mode="quality",
                        model_in_path=model_path,
                        model_out_path=model_path)
