from celery import Celery
from celery.concurrency import asynpool

# Use AMQP backend as otherwise the result status are not stored
celery_app = Celery("worker", backend="amqp://", broker="amqp://guest@queue//", include=["app.worker.transcribe"])

default_config = "app.worker.celeryconfig"
celery_app.config_from_object(default_config)