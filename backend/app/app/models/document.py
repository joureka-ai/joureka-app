"""ORM model for a document in the system"""

from sqlalchemy import Column, Integer, String, ForeignKey, Index
from sqlalchemy.orm import relationship, deferred
from sqlalchemy_utils import TSVectorType

from app.db.base_class import Base

from .transcript.aws import AWSTranscription
from .word import Word
from .annot import Annot


class Document(Base):
    """ORM model for a document"""
    
    __table_name__ = "document"
    __table_args__ = (
        Index(
            "Document_fulltext_search_vector_idx",
            "fulltext_search_vector",
            postgresql_using="gin",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    audio_file_key = Column(String, nullable=True)
    peaks_file_key = Column(String, nullable=True)
    language = Column(String, nullable=True)

    fk_aws_transcription = Column(Integer, ForeignKey("aws_transcription.id"))
    transcription = relationship(AWSTranscription)

    fulltext = deferred(Column(String, nullable=True))
    fulltext_search_vector = deferred(Column(TSVectorType("fulltext")))
    fulltext_regconfig = deferred(Column(String, nullable=True))

    annotations = relationship(Annot, cascade="all, delete-orphan")
    words = relationship(Word, cascade="all, delete-orphan", order_by=Word.order)
    fk_project = Column(Integer, ForeignKey("project.id"))



Word.document = relationship(Document, back_populates="words")
Annot.document = relationship(Document, back_populates="annotations")
