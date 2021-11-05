from typing import Any
from fastapi import Depends
import boto3

from sqlalchemy.orm import Session
from sqlalchemy import func

from app import crud
from app.api import deps
from app.transcription import aws
from app.models import Language
from app import models

from ..router import router

language_to_regconfig = {
    Language.de_DE: "german",
    Language.en_GB: "english",
    Language.en_US: "english",
    Language.es_ES: "spanish",
}


@router.post("/{document_id}/transcribe/aws")  # , response_model=schemas.Document
def transcribe_with_aws(
    document_id: int,
    aws_bucket_name: str = "soundqesstt",
    lang: str = "de-DE",
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific document by id.
    """

    document = crud.document.get(db, id=document_id)

    aws.transcribe_document(document, aws_bucket_name=aws_bucket_name, lang=lang, db=db)

    assert document.transcription

    document.fulltext = document.transcription.full_text
    document.fulltext_search_vector = func.to_tsvector(document.transcription.full_text)
    document.fulltext_regconfig = language_to_regconfig.get(Language(document.language))

    if not document.fulltext_regconfig:
        raise ValueError(f"Not regconfig known for language {document.language}.")

    db.commit()
    db.refresh(document)

    return document
