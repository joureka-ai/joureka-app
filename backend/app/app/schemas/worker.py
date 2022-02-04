from typing import Optional, Any
from pydantic import BaseModel

class TaskResult(BaseModel):
    id: str
    doc_id: int
    runtime: float
    status: str
    error: Optional[str]
    result: Optional[str]