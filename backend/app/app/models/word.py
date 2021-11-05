"""ORM model for a document in the system"""

from sqlalchemy import Column, Integer, String, Float, Interval, ForeignKey, Boolean

from sqlalchemy.orm import relationship

from app.db.base_class import Base



class Word(Base):
    """ORM model for a document"""
    __table_name__ = "word"
    
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String)
    initial_order = Column(Integer)
    current_order = Column(Integer)
    start_time = Column(Interval)
    end_time = Column(Interval)
    confidence = Column(Float)
    edited = Column(Boolean, nullable=False, default=False)
    edit_version_no = Column(Integer)

    fk_document = Column(Integer, ForeignKey("document.id"))
