from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON

# from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Transcription(Base):
    __tablename__ = "transcription"

    id = Column(Integer, primary_key=True, index=True)

    raw = Column(JSON, nullable=True)
    full_text = Column(Text, nullable=True)
