from typing import Any, Optional, List

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from app import models, crud, schemas
from app.api import deps
from jouresearch_nlp.wordcloud.frequency import calculate_freq_over_docs
from jouresearch_nlp.topicmodelling.representation import generate_topics
from jouresearch_nlp.topicmodelling.load import load_model, check_modelpath
from .helper import calcuate_frequencies, transform_word_freqs, gather_annots_by_type, gather_fulltext_for_tm
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
    ) -> Any:
    """
    Generate the frequencies pins in either a single document or in all of the documents of a project.
    - Args: Project ID and the OPTIONAL document ID
    - Returns: The pins with frequency and corresponding document.
    """

    pins = gather_annots_by_type(db, project_id, "Pin", document_id)
    
    if pins:
        return calcuate_frequencies(pins)
    else:
        return []

    

@router.get('/{project_id}/topicplot/')
def get_topic_frequencies(
    project_id: int,
    document_id: Optional[int] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> Any:
    """
    Generate the frequencies topics in either a single document or in all of the documents of a project.
    - Args: Project ID and the OPTIONAL document ID
    - Returns: The topics with frequency and corresponding document.
    """

    topics = gather_annots_by_type(db, project_id, "Topic", document_id)
    
    if topics:
        return calcuate_frequencies(topics)
    else: 
        return []


@router.post('/{project_id}/topicmodel/')
def generate_modelled_topics(
    project_id: int,
    top_n_words: Optional[int] = 3,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.Topics:
    """
    Generate topics for a project via unsupervised Topic Modeling. 
    The parameter top_n_words defines with how many words a topic is described.
    - Args: Project ID and top_n_words
    - Returns: The Topics described by X, Y, label, size and words.
    """

    documents = crud.document.get_all_by_p_id(db, project_id)

    if not documents:
        raise HTTPException(
            status_code=404, detail="There are no documents existing for this project."
        )

    docs, numd, artif_increased = gather_fulltext_for_tm(documents)
    
    # construct unique model name wrt to project_id and numbers of documents
    model_name = f"bertopic_pid{project_id}_numd{numd}_tnw{top_n_words}_enh{artif_increased}"
    model_path = f"{settings.NLP_MODEL_DIR}topicmodel/{model_name}"
    
    topic_models = crud.topic_model.get_all_by_mn(db, project_id, model_name)

    if not topic_models:

        if artif_increased == "Y":
            len_docs = len(documents)
            LOG.info(f"There are with {len_docs} documents too few documents for unsupervised Topic Modeling!")
            LOG.info(f"To overcome this limitation, the existing documents are artificially increased by copying.")

        LOG.info(f"There are no topic models for the project id {project_id} and the model_name \"{model_name}\" !")
        LOG.info("Creating Topic Models.")

        topic_models = generate_topics(docs, top_n_words=top_n_words, 
                        mode="quality",
                        model_in_path=model_path,
                        model_out_path=model_path)


        LOG.info("Storing created Topic Models.")

        for topic in topic_models.topics:
            
            # Parse the data to database
            topic_model = schemas.TopicModelCreate(**topic.dict())
            topic_model.fk_project = project_id
            topic_model.model_name = model_name

            #LOG.info(topic_model.dict())
            crud.topic_model.create(db=db, obj_in=topic_model)
            
        LOG.info("Created Topic Models are now stored.")

        topic_models = crud.topic_model.get_all_by_mn(db, project_id, model_name)

    # Take care of parsing the data from SQLAlchemy to pydantic model
    tmp_tm = []
    for topic in topic_models:
        tmp_tm.append(schemas.Topic(
            id=topic.id,
            x=topic.x,
            y=topic.y,
            label=topic.label,
            words= [schemas.TWord(word=w.word, frequency=w.frequency) for w in topic.words],
            size=topic.size
            ))

    topic_models = tmp_tm

    return topic_models

@router.put('/{project_id}/topicmodel/{topic_id}')
def rename_modelled_topics(
    project_id: int,
    topic_id: int,
    topic_in: schemas.TopicModelUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> schemas.Topic:
    """
    Rename a specific topic model by id.
    """

    topic_model = crud.topic_model.get_by_pid(db, project_id, topic_id)

    if not topic_model:
        raise HTTPException(
            status_code=404, detail="There is no Topic Model for this project or with this ID."
        )

    # update the label of the existing topic model
    topic_model = crud.topic_model.update(db, db_obj=topic_model, obj_in=topic_in)

    return topic_model

@router.delete('/{project_id}/topicmodel/{topic_id}')
def delete_modelled_topic(
    project_id: int,
    topic_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
    ) -> Any:
    """
    Delete a specific topic model by id.
    """
    try:
        crud.topic_model.remove(db, id=topic_id)
    except Exception as e:
        raise HTTPException(
            status_code=409,
            detail=f"{e}"
        )