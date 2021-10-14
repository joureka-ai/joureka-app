from typing import Any

from fastapi import APIRouter, Depends, BackgroundTasks

from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps
from app.core.celery_app import celery_app

import logging

from app import crud

router = APIRouter()

LOG = logging.getLogger(__name__)

@router.post("/test-celery/", response_model=schemas.Msg, status_code=201)
def test_celery(
    msg: schemas.Msg,
    queue: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_superuser),
    db: Session = Depends(deps.get_db),
    ) -> Any:
    """
    Test Celery worker.
    """
    task = celery_app.send_task(
     name="worker.test_celery",
     args=[msg.msg],
     queue="main-queue")
    

    return {"msg": f"{task.id}"}

