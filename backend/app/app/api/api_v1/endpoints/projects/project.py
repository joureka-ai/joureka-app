import logging
from typing import List, Any
from uuid import uuid4
from pathlib import Path

from sqlalchemy.orm import Session

from fastapi import File, UploadFile, Depends, HTTPException
from fastapi.responses import FileResponse

from app import crud, models, schemas, file_storage
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

from .router import router


LOG = logging.getLogger(__name__)


@router.post("/", response_model=schemas.Project)
def create_project(
    *,
    project_in: schemas.ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> schemas.Project:
    try:
        project = crud.project.create(db, obj_in=project_in)
    # Handle creation of unique project names
    except Exception as e:
        raise HTTPException(
            status_code=409,
            detail=str(e),
        )

    return project

@router.get("/", response_model=List[schemas.Project])
def read_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> List[schemas.Project]:
    """
    Retrieve projects.
    """
    projects = crud.project.get_multi(db, skip=skip, limit=limit)
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def read_project_by_id(
    project_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific project by id.
    """
    project = crud.project.get(db, id=project_id)
    return project

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: int,
    project_in: schemas.ProjectUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> schemas.Project:
    """
    Update a project.
    """
    project = crud.project.get(db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="The project with this id does not exist in the system",
        )
        
    project = crud.project.update(db, db_obj=project, obj_in=project_in)
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific project by id.
    """
    crud.project.remove(db, id=project_id)



@router.post("/{project_id}/docs/", response_model=schemas.Document)
async def create_document(
    *,
    project_id: int,
    document_in: schemas.DocumentCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> schemas.Document:
    
    project = crud.project.get(db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="The project with this id does not exist in the system",
        )

    document = crud.document.create(db, obj_in=document_in)

    return document


@router.get("/{project_id}/docs/", response_model=List[schemas.Document])
def read_documents(
    project_id: int,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> List[schemas.Document]:
    """
    Retrieve documents.
    """
    documents = crud.document.get_multi_by_p_id(db, skip=skip, limit=limit, fk_project=project_id)
    return documents


@router.get("/{project_id}/docs/{document_id}", response_model=schemas.Document)
def read_document_by_id(
    project_id: int,
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific document by id.
    """

    document = crud.document.get_by_p_id(db, id=document_id, fk_project=project_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id and project id does not exist in the system",
        )
    return document


@router.put("/{project_id}/docs/{document_id}", response_model=schemas.Document)
def update_document(
    *,
    project_id: int,
    db: Session = Depends(deps.get_db),
    document_id: int,
    document_in: schemas.DocumentUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> schemas.Document:
    """
    Update a document.
    """
    document = crud.document.get_by_p_id(db, id=document_id, fk_project=project_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id and project id does not exist in the system",
        )
    document = crud.document.update(db, db_obj=document, obj_in=document_in)
    return document


@router.delete("/{project_id}/docs/{document_id}")
def delete_document(
    project_id: int,
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get a specific document by id.
    """
    crud.document.remove_by_p_id(db, id=document_id, fk_project=project_id)


@router.get("/{project_id}/docs/{document_id}/file")
async def download_file(
    project_id: int,
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
):
    document = crud.document.get_by_p_id(db, id=document_id, fk_project=project_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="The document with this id does not exist in the system",
        )

    if not document.audio_file_key:
        raise HTTPException(
            status_code=404,
            detail="The document with this id has no file",
        )

    return file_storage.create_presigned_url(document.audio_file_key)


@router.post("/{project_id}/docs/{document_id}/file")
async def upload_file(
    project_id: int,
    document_id: int,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_superuser),
):
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

    await crud.document.create_audio_file(db, document, file, suffix)