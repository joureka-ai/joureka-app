from fastapi import UploadFile

from pathlib import Path
import hashlib
from typing import Optional

from pydantic import BaseSettings, Field

from .setting import settings


def create_suffix(filename: str) -> str:
    """
    Takes a filename or a filepath that only one contains a single dot and returns everything after the dot.
    filepath/file/1234.mp3 - > .mp3
    """
    filetype = filename.rsplit(".", 1)
    return f".{filetype[-1]}"

def get_name_and_suffix(filekey:str) -> str:
    file_w_suffix = filekey.split("/", 1)[-1]
    filename, suffix = file_w_suffix.rsplit(".", 1)
    return filename, suffix

def get_transcript_key(
    filekey: str, lang: str, model: str
) -> str:
    """construct a unique object key for transcripts"""

    return f"transcript/default_project/{filekey}.{lang}.{model}.json"


def get_transcript_path(transcript_key: str) -> Path:

    transcript_path = settings.file_storage / transcript_key

    return transcript_path


async def get_hash(upload: UploadFile) -> str:
    """computes the sha256 hash of an uploaded"""

    h = hashlib.md5()

    while True:
        # Reading is buffered, so we can read smaller chunks.
        chunk = await upload.read(h.block_size)
        if not chunk:
            break
        h.update(chunk)

    await upload.seek(0)
    return h.hexdigest()
