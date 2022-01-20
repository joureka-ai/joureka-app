from pathlib import Path
from temppathlib import NamedTemporaryFile
import logging
from typing import Optional
import json
from fastapi import UploadFile
from typing import Union

from app import models
from .setting import settings, s3_resource, s3_client

from botocore.exceptions import ClientError


LOG = logging.getLogger(__name__)


def exist(key: str) -> bool:
    # Returns true if there is a file with the corresponding key in the bucket
    # The Contents key is only present in the response if the file exists.
    try:
        s3_resource.Object(settings.BUCKET_NAME, key).load()
        return True
    except:
        return False


def get_file_for_doc(document: models.Document) -> Path:

    assert document
    assert document.audio_file_key

    return get_file_for_key(document.audio_file_key)

def get_file_for_key(file_key: str, suffix: Optional[str] = ".mp3") -> Optional[NamedTemporaryFile]:
    bucket = s3_resource.Bucket(settings.BUCKET_NAME)

    tmp_file = NamedTemporaryFile(suffix=suffix)

    try:
        bucket.download_file(file_key, str(tmp_file.path))
    except Exception as e:
        LOG.error("An error occured while getting the file from minio: %s", e)
        return None

    return tmp_file


async def upload_to_bucket_async(file_key: str, file: Union[UploadFile, NamedTemporaryFile]) -> Path:
    bucket = s3_resource.Bucket(settings.BUCKET_NAME)

    if not bucket.creation_date:
        bucket.create()

    file_bytes = await file.read()
    
    if exist(file_key):
        LOG.warning("File with key %s already exists. Not uploading.", file_key)
    else:
        LOG.warning("File %s is being added to local storage.", file_key)
        bucket.put_object(Body=file_bytes, Key=file_key)

    return file_key

def upload_to_bucket_sync(file_key: str, file: Union[UploadFile, NamedTemporaryFile]) -> Path:
    bucket = s3_resource.Bucket(settings.BUCKET_NAME)

    if not bucket.creation_date:
        bucket.create()

    file_bytes = file.read()
    
    if exist(file_key):
        LOG.warning("File with key %s already exists. Not uploading.", file_key)
    else:
        LOG.warning("File %s is being added to local storage.", file_key)
        bucket.put_object(Body=file_bytes, Key=file_key)

    return file_key


def dump_transcript(transcript: dict) -> NamedTemporaryFile:
    tmp = NamedTemporaryFile(mode="r", suffix=".json")
    json.dump(
        obj=transcript,
        ensure_ascii=False,
        indent=4,
        fp=open(
            file=str(tmp.path),
            mode="w",
            encoding="utf-8"))
    return tmp

def create_presigned_url(file_key, expiration=3600):
    """Generate a presigned URL to share an S3 object
    """
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': settings.BUCKET_NAME,
                                                            'Key': file_key},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    return response