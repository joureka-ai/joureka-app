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

class TWord(BaseModel):
    word: str
    frequency: float

class Topic(BaseModel):
    id: int
    x: int
    y: int
    label: str
    words: List[TWord]
    size: int

class Topics(BaseModel):
    topics: List[Topic]

    class Config:
        arbitrary_types_allowed = True

class TopicModelCreate(BaseModel):
    x: int
    y: int
    label: str
    words: List[TWord]
    size: int
    fk_project: Optional[int]
    model_name: Optional[str]

class TopicModelUpdate(BaseModel):
    label: str