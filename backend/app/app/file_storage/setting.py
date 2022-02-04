from pathlib import Path
from typing import Optional
from pydantic import BaseSettings, Field


import boto3
from botocore.client import Config


class Settings(BaseSettings):
    MINIO_INTERN: Optional[str] = Field(None, env="FILE_STORE_INTERN")
    MINIO_EXTERN: Optional[str] = Field(None, env="FILE_STORE_EXTERN")
    # For MINIO usage the "file-store" value is needed
    BUCKET_NAME: str = Field("file-store", env="FILE_STORE_BUCKET")
    # For MINIO usage env variable needed
    FILE_STORE_ID: Optional[str] = Field(None, env="FIRST_SUPERUSER")
    # For MINIO usage env variable needed
    FILE_STORE_ACCESS_KEY: Optional[str] = Field(None, env="FIRST_SUPERUSER_PASSWORD")

settings = Settings()

s3_resource = boto3.resource(
    "s3",
    endpoint_url=settings.MINIO_INTERN,
    aws_access_key_id=settings.FILE_STORE_ID,
    aws_secret_access_key=settings.FILE_STORE_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
    region_name="eu-central-1",
)
# for generating presigned URLs
s3_client = boto3.client(
    "s3",
    endpoint_url=settings.MINIO_EXTERN,
    aws_access_key_id=settings.FILE_STORE_ID,
    aws_secret_access_key=settings.FILE_STORE_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
    region_name="eu-central-1",
)