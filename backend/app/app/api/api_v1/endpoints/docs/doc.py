import logging
from typing import List, Any
from uuid import uuid4
from pathlib import Path

from sqlalchemy.orm import Session

from fastapi import File, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

from app import crud, models, schemas, file_store
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

from .router import router


LOG = logging.getLogger(__name__)


@router.post("/", response_model=schemas.Document)
async def create_document(
    *,
    document_in: schemas.DocumentCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> schemas.Document:

    document = crud.document.create(db, obj_in=document_in)

    return document


@router.get("/", response_model=List[schemas.Document])
def read_documents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> List[schemas.Document]:
    """
    Retrieve documents.
    """
    documents = crud.document.get_multi(db, skip=skip, limit=limit)
    return documents


@router.get("/{document_id}", response_model=schemas.Document)
def read_document_by_id(
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific document by id.
    """
    document = crud.document.get(db, id=document_id)
    return document


@router.put("/{document_id}", response_model=schemas.Document)
def update_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    document_in: schemas.DocumentUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> schemas.Document:
    """
    Update a document.
    """
    document = crud.document.get(db, id=document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id does not exist in the system",
        )
    document = crud.document.update(db, db_obj=document, obj_in=document_in)
    return document


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific document by id.
    """
    crud.document.remove(db, id=document_id)


@router.get("/{document_id}/file")
async def download_file(
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
):

    document = crud.document.get(db, id=document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id does not exist in the system",
        )

    if not document.filename:
        raise HTTPException(
            status_code=404,
            detail="The document with this id has no file",
        )

    try:
        target_path = file_store.get_file_for_doc(document)
    except ValueError as err:
        raise HTTPException(
            status_code=404,
            detail=str(err),
        )
    assert target_path.is_file()

    return FileResponse(target_path)


@router.post("/{document_id}/file")
async def upload_file(
    document_id: int,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_superuser),
):
    settings = file_store.Settings()

    document = crud.document.get(db, id=document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id does not exist in the system",
        )

    LOG.warning(
        "Processing uploaded file %s of content type %s.",
        file.filename,
        file.content_type,
    )

    file_key = await file_store.get_hash(file)

    target_file_name = file_key + Path(file.filename).suffix
    target_path = settings.file_store / target_file_name

    target_path.write_bytes(await file.read())

    document.filename = target_file_name

    db.commit()
