import importlib
import boto3

import time

from app import crud, schemas
from app.file_storage import get_name_and_suffix, dump_transcript, get_transcript_key, upload_to_bucket_async, upload_to_bucket_sync 
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
            LOG.info('Loading Transcription Engine')
            module_import = importlib.import_module(self.path[0])
            model_obj = getattr(module_import, self.path[1])
            self.model = model_obj()
            LOG.info('Transcription Engine loaded')
        
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
    name="worker.transcribe.wav2vec2",
    path=("app.worker.model", "Wav2Vec2Engine"))
def transcribe(self,
    filekey: str,
    document_id: int,
    project_id: int,
    model: str
    ) -> str:

    document = crud.document.get_by_p_id(self.db, document_id, project_id)
    LOG.info("Running Wav2Vec2 Transcription Job")
    transcription = self.model.transcribe(filekey)

    filename, _ = get_name_and_suffix(filekey)
    transcript_key = get_transcript_key(filename, lang=document.language, model=model)

    tmp_file = dump_transcript(transcription)
    uploaded_file_key = upload_to_bucket_sync(transcript_key, tmp_file.file)
    assert uploaded_file_key

    crud.document.update_fulltext(self.db, document, transcription[0]["transcription"])

    return uploaded_file_key


@celery_app.task(ignore_result=False,
    bind=True,
    base=TranscribeTask,
    name="worker.transcribe.vosk",
    path=("app.worker.model", "VoskEngine"))
def transcribe(self,
    filekey: str,
    document_id: int,
    project_id: int,
    model: str
    ) -> str:

    document = crud.document.get_by_p_id(self.db, document_id, project_id)

    filename, _ = get_name_and_suffix(filekey)
    transcript_key = get_transcript_key(filename, lang=document.language, model=model)
    trans_job = transcript_key.replace("/", "_")
    jobName = f"local_{trans_job}"

    LOG.info("Running Vosk Transcription Job")
    audio_bytes = self.model.load_audio(filekey)
    transcription = self.model.transcribe(audio_bytes, jobName)
    assert transcription

    LOG.info("Uploading Transcription Job as file")
    tmp_file = dump_transcript(transcription)
    uploaded_file_key = upload_to_bucket_sync(transcript_key, tmp_file.file)
    assert uploaded_file_key
    LOG.info(f"Transcription Job uploaded at: {uploaded_file_key}")

    full_text = transcription["results"]["transcripts"][0]["transcript"]
    crud.document.update_fulltext(self.db, document, full_text)
    crud.document.update_transcription(self.db, document, transcription)
    crud.document.update_words(self.db, document, transcription)

    return uploaded_file_key