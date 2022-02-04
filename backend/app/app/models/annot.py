"""ORM model for a annotation in the system"""

from sqlalchemy import Column, Integer, String, Float, Interval, ForeignKey

from sqlalchemy.orm import deferred

from app.db.base_class import Base


class Annot(Base):
    """ORM model for Annotations"""
    __table_name__ = "annotation"
    
    id = Column(Integer, primary_key=True, index=True)
    
    external_id = Column(String, unique=True)
    label = Column(String)
    type = Column(String)
    description = deferred(Column(String))
    start_time = Column(Interval)
    end_time = Column(Interval)

    fk_document = Column(Integer, ForeignKey("document.id"))
