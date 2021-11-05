from datetime import timedelta

from pydantic import BaseModel

from typing import List, Optional

class Word(BaseModel):

    id: int
    word: str
    start_time: timedelta
    end_time: timedelta
    confidence: float

    class Config:
        orm_mode = True

class Words(BaseModel):
    words: List[Word]

class EditedWordsIn(BaseModel):
    start_time: float
    end_time: float
    text: str

class EditedWordMeta(BaseModel):
    fk_document: int
    current_order: Optional[int]
    initial_order: Optional[int]