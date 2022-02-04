from raven import Client
import time

from . import celery_app
from app.core.config import settings
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


@celery_app.task(acks_late=True, name="worker.test_celery")
def test_celery(word: str) -> str:
    return f"test test test return {word}"
