import logging
from typing import List, Any
from uuid import uuid4
from pathlib import Path

from pydantic import BaseSettings, Field

from sqlalchemy.orm import Session

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

from app import crud, models, schemas
from app.schemas.document import FilteredDocument
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

router = APIRouter()


LOG = logging.getLogger(__name__)


@router.get("/", response_model=List[FilteredDocument])
def get_filtered_documents(
    filter: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> List[FilteredDocument]:
    """
    Retrieve documents.
    """
    documents = crud.document.filter_document(
        db, skip=skip, limit=limit, filter_str=filter
    )
    return documents
