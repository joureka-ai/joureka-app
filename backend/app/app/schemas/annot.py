from typing import Optional, List, Union
from datetime import timedelta
from pydantic import BaseModel

# Shared properties
class AnnotBase(BaseModel):
    external_id: str
    label: str
    type: Optional[str]
    description: Optional[str]
    start_time: timedelta
    end_time: timedelta
    fk_document: Optional[int] = None
    
# Properties to receive via API on creation
class AnnotCreate(AnnotBase):
    fk_document: Optional[int]

# Properties to receive via API on update
class AnnotUpdate(BaseModel):
    label: Optional[str]
    description: Optional[str]
    start_time: Optional[timedelta]
    end_time: Optional[timedelta]

class AnnotInDBBase(AnnotBase):
    id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class Annot(AnnotInDBBase):
    pass


# Additional properties stored in DB
class AnnotInDB(AnnotInDBBase):
    pass

class AnnotPin(BaseModel):
    id: int
    external_id: str
    time: Union[float,int]
    label: str

class TopicData(BaseModel):
    label: str
    description: Optional[str]

class AnnotTopicIn(BaseModel):
    external_id: str
    start: Union[float,int]
    end: Union[float,int]
    data: TopicData

class AnnotTopicOut(BaseModel):
    id: int
    external_id: str
    start: Union[float,int]
    end: Union[float,int]
    data: TopicData

class TopicDataUpdate(BaseModel):
    label: Optional[str]
    description: Optional[str]

class AnnotUpdatePinTop(BaseModel):
    start: Optional[Union[float,int]]
    end: Optional[Union[float,int]]
    data: Optional[TopicDataUpdate]

