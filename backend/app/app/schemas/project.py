from typing import Optional, List

from pydantic import BaseModel

# Shared properties
class ProjectBase(BaseModel):
    name: str
    description: Optional[str]

# Properties to receive via API on creation
class ProjectCreate(ProjectBase):
    pass


# Properties to receive via API on update
class ProjectUpdate(ProjectBase):
    name: Optional[str]


class ProjectInDBBase(ProjectBase):
    id: int

    class Config:
        orm_mode = True


# Additional properties to return via API
class Project(ProjectInDBBase):
    pass


# Additional properties stored in DB
class ProjectInDB(ProjectInDBBase):
    pass