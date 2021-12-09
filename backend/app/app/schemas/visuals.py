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
