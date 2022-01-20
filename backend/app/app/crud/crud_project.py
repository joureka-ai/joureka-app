from typing import Any, Dict, Optional, List

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    pass

project = CRUDProject(Project)
