from typing import Any, Optional

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas, crud
from app.api import deps
from app.core.celery_app import celery_app
from app.utils import write_log
from app.models.engines import Engines
from app.file_storage import get_transcript_key

router = APIRouter()


@router.post("/{project_id}/docs/{document_id}", status_code=201)
def transcribe(
    project_id: int,
    document_id: int,
    background_task: BackgroundTasks,
    engine: Engines = Engines.vosk,
    current_user: models.User = Depends(deps.get_current_active_superuser),
    db: Session = Depends(deps.get_db),
) -> Any:
    document = crud.document.get_by_p_id(db, document_id, project_id)

    if not document:
        raise HTTPException(
            status_code=404, detail="There is no document with those IDs."
        )

    audio_file_key = document.audio_file_key
    assert audio_file_key

    if document.fulltext:
        raise HTTPException(
            status_code=409, detail="There is already an existing transcript!"
        )
    
    #celery_app.Task.track_started = True

    task = celery_app.send_task(
        name=f"worker.transcribe.{engine}",
        args=[audio_file_key, document_id, project_id, engine],
        queue="main-queue",
        
    )

    background_task.add_task(write_log, task.id, document_id)

    crud.document.update_task_id(db, document, str(task.id))

    return {"msg": f"{task.id}"}


@router.get("/{project_id}/docs/{document_id}/status/{task_id}")
def transcription_job_status(
    project_id: int,
    document_id: int,
    task_id: str,
    current_user: models.User = Depends(deps.get_current_active_superuser),
    db: Session = Depends(deps.get_db),
) -> str:
    result = celery_app.AsyncResult(id=task_id)
    return str(result.state)
