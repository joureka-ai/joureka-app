"""ORM model for a project in the system"""

from sqlalchemy import Column, Integer, String, ForeignKey, Index
from sqlalchemy.orm import relationship

# from sqlalchemy.orm import relationship

from app.db.base_class import Base
from .document import Document



class Project(Base):
    """ORM model for a Project"""

    __table_name__ = "project"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    documents = relationship(Document, cascade="all, delete-orphan")

    fk_user = Column(Integer, ForeignKey("user.id"))

Document.project = relationship(Project, back_populates="documents")