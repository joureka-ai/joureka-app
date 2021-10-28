import importlib
import boto3

import time

from app import crud, schemas
from app.file_storage import get_name_and_suffix, dump_transcript, get_transcript_key, upload_to_bucket
from app.core.celery_app import celery_app

from . import SessionLocal

import logging
from celery import Task

LOG = logging.getLogger(__name__)

class TranscribeTask(Task):
    """
    Abstraction of Celery's Task class to support loading ML model.
    """
    abstract = True

    def __init__(self):
        super().__init__()
        self.model = None
        self.db =  None

    def __call__(self, *args, **kwargs):
        """
        Load model on first call (i.e. first task processed)
        Avoids the need to load model on each task request
        """
        if not self.model:
            LOG.info('Loading Wav2Vec2Engine')
            module_import = importlib.import_module(self.path[0])
            model_obj = getattr(module_import, self.path[1])
            self.model = model_obj()
            LOG.info('Wav2Vec2Engine loaded')
        
        if not self.db:
            self.db = SessionLocal()
            LOG.info('PostgreSQL DB connection alive')

        return self.run(*args, **kwargs)

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        self.db.close()
        self.db = None
        LOG.info('PostgreSQL DB connection closed')

@celery_app.task(ignore_result=False,
    bind=True,
    base=TranscribeTask,
    name="worker.transcribe",
    path=("app.worker.model", "Wav2Vec2Engine"))
def transcribe(self,
    filekey: str,
    document_id: int,
    project_id: int
    ) -> str:

    document = crud.document.get_by_p_id(self.db, document_id, project_id)
    LOG.info("Running Transcription Job")
    transcription = self.model.transcribe(filekey)

    filename, _ = get_name_and_suffix(filekey)
    transcript_key = get_transcript_key(filename, lang=document.language, model="wav2vec2")

    tmp_file = dump_transcript(transcription)
    # TODO: Make async version of it.
    uploaded_file_key = upload_to_bucket(transcript_key, tmp_file.file)
    assert uploaded_file_key

    crud.document.update_fulltext(self.db, document, transcription[0]["transcription"])

    return uploaded_file_key