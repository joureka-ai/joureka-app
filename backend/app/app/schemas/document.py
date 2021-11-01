from typing import Optional, List
import enum

from pydantic import BaseModel

from .word import Word


class Language(enum.Enum):
    """Enum for the languages we support"""

    de_DE = "de-DE"
    en_GB = "en-GB"
    en_US = "en-US"
    es_ES = "es-ES"


class Transcription(BaseModel):

    id: int

    full_text: Optional[str]

    class Config:
        orm_mode = True


# Shared properties
class DocumentBase(BaseModel):
    title: Optional[str] = None
    language: Optional[Language] = Language.de_DE
    fk_project: Optional[int] = None

# Properties to receive via API on creation
class DocumentCreate(DocumentBase):
    pass


# Properties to receive via API on update
class DocumentUpdate(DocumentBase):
    pass


class DocumentInDBBase(DocumentBase):
    id: Optional[int] = None
    audio_file_key: Optional[str]
    fulltext: Optional[str]
    fulltext_regconfig: Optional[str]
    words: List[Word] = []

    class Config:
        orm_mode = True


# Additional properties to return via API
class Document(DocumentInDBBase):
    pass


# Additional properties stored in DB
class DocumentInDB(DocumentInDBBase):
    pass


class HeadlineToken(BaseModel):
    """One token of a headline"""

    text: str
    match: bool


class Headline(BaseModel):
    """Model for a headline"""

    tokens: List[HeadlineToken]


class FilteredDocument(BaseModel):
    """Model for returned by the filter_document"""

    document: Document
    headlines: List[Headline]
