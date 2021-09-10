"""ORM model for a document in the system"""

from sqlalchemy import Column, Integer, String, Float, Interval, ForeignKey

from sqlalchemy.orm import relationship

from app.db.base_class import Base

from .transcript.aws import AWSTranscription


class Word(Base):
    """ORM model for a document"""
    __table_name__ = "word"
    
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String)
    order = Column(Integer)
    start_time = Column(Interval)
    end_time = Column(Interval)
    confidence = Column(Float)

    fk_document = Column(Integer, ForeignKey("document.id"))
