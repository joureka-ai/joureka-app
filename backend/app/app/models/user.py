"""Model for a user in the system"""

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from .project import Project

class User(Base):
    """ORM class for a User"""
    
    __table_name__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)

    projects = relationship(Project, cascade="all, delete-orphan")


Project.user = relationship(User, back_populates="projects")