from celery import Celery
from celery.concurrency import asynpool


celery_app = Celery("worker", backend="rpc://", broker="amqp://guest@queue//", include=["app.worker.transcribe"])
