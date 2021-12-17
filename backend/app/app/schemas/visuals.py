from pydantic import BaseModel

from typing import List, Optional

class AnnotFreq(BaseModel):
    name: str
    frequency: int
    recordings: List[int]

class AnnotFrequencies(BaseModel):
    annots: List[AnnotFreq]


class WordFreq(BaseModel):
    word: str
    frequency: int
    recordings: List[int]

class WordFrequencies(BaseModel):
    words: List[WordFreq]

class Word(BaseModel):
    word: str
    freq: float

class Topic(BaseModel):
    x: int
    y: int
    label: str
    words: List[Word]
    size: int

class Topics(BaseModel):
    topics: List[Topic]

    class Config:
        arbitrary_types_allowed = True