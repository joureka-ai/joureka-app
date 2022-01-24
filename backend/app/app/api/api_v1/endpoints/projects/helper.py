import logging
from typing import List, Union, Any
from app import crud 
from app.schemas import Annot, AnnotTopicIn, AnnotPin, TopicData, AnnotUpdate, AnnotTopicOut
from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, File
from app import file_storage

LOG = logging.getLogger(__name__)

def check_doc_for_upload(db: Session, document_id: int, project_id: int, file: File):
    """
    Gets the document and validates that it is ready for receiving a mediafile.
    - Args: db ... databaase connection, document_id ... ID of the document to upload, project_id ... ID of the corresponding project, 
    file ... file to upload
    - Returns: the checked document
    """
    document = crud.document.get_by_p_id(db, id=document_id, fk_project=project_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id does not exist in the system",
        )

    if document.audio_file_key:
        raise HTTPException(
            status_code=409,
            detail="There is already a file attached to this document. Please delete the attached file first!",
        )
    
    suffix = file_storage.create_suffix(file.filename)
    if not suffix in [".mp3"]:
        raise HTTPException(
            status_code=422,
            detail="The file you provided is not supported. Please only upload mp3 files",
        )

    LOG.warning(
        "Processing uploaded file %s of content type %s.",
        file.filename,
        file.content_type,
    )

    return document, suffix


def transform_to_annots(annots: List[Annot]) -> List[Union[AnnotTopicOut, AnnotPin]]:
    """
    Takes a list of annotations and transforms to either Topic or Pin data structure. The data strucures are needed by frontend.
    - Args: List of annotations.
    - Returns: A list of Annotations that are either Pins or Topics.
    """
    list_annots = []
    
    for ann in annots:
        if ann.type == "Topic":
            data = TopicData(
                        label=ann.label,
                        description=ann.description
                    )
            top_pin = AnnotTopicOut(
                        id=ann.id,
                        external_id=ann.external_id,
                        start=ann.start_time.total_seconds(),
                        end=ann.end_time.total_seconds(),
                        data=data
                    )

        if ann.type == "Pin":
            top_pin = AnnotPin(
                id=ann.id,
                external_id=ann.external_id,
                time=ann.start_time.total_seconds(),
                label=ann.label
                )

        list_annots.append(top_pin)

    return list_annots

def transform_annot_in(annot_in: AnnotTopicIn) -> AnnotUpdate:
    """
    Takes incoming annotation (from WaveSurfer.JS) and transforms it to annotation data model for database.
    - Args: Single Annotation - either Topic or Pin.
    - Returns: Topic or Pin that can be used for updating in database.
    """

    annot = AnnotUpdate()

    if annot_in.end and annot_in.start:
        annot.end_time = timedelta(seconds=annot_in.end)
        annot.start_time = timedelta(seconds=annot_in.start)

    if annot_in.data:
        if annot_in.data.label:
            annot.label = annot_in.data.label
        if annot_in.data.description:
            annot.description = annot_in.data.description

    return annot
     