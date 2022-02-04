from pydantic import BaseModel
from typing import List, Optional

class Transcript(BaseModel):
    transcript: str

class Segment(BaseModel):
    start_time: str
    speaker_label: Optional[str]
    end_time: str

class SpeakerLabel(BaseModel):
    speakers: int
    segments: List[Segment]

class Alternative(BaseModel):
    confidence: str
    content: str

class Item(BaseModel):
    start_time: str
    end_time: str
    alternatives: List[Alternative]

class Results(BaseModel):
    transcripts: List[Transcript]
    speaker_labels: Optional[List[SpeakerLabel]]
    items: List[Item]

class TranscriptionResults(BaseModel):
    jobName: str
    results: Results
    status: str