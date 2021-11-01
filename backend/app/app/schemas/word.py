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