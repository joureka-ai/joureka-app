from pydantic import BaseModel

from typing import List, Optional

class PinFreq(BaseModel):
    name: str
    frequency: int
    recordings: List[int]

class PinFrequencies(BaseModel):
    pins: List[PinFreq]


class WordFreq(BaseModel):
    word: str
    frequency: int
    recordings: List[int]

class WordFrequencies(BaseModel):
    words: List[WordFreq]
