from typing import Any, Dict, Optional, List

from sqlalchemy import func, text
from sqlalchemy.orm import Session
from datetime import timedelta

from app.schemas import AnnotTopicIn
from app.crud.base import CRUDBase
from app.models.annot import Annot
from app.schemas.annot import (
    AnnotCreate,
    AnnotUpdate,
)


class CRUDAnnot(CRUDBase[Annot, AnnotCreate, AnnotUpdate]):
    def get_by_doc_id(self, db: Session, id: int, fk_document: int) -> Optional[Annot]:
        return (
            db.query(self.model)
            .filter(self.model.fk_document == fk_document)
            .filter(self.model.id == id)
            .first()
        )

    def rem_by_doc_id(self, db: Session, id: int, fk_document: int) -> Optional[Annot]:
        obj = (
            db.query(self.model)
            .filter(self.model.fk_document == fk_document)
            .filter(self.model.id == id)
            .first()
        )
        db.delete(obj)
        db.commit()
        return obj

    def get_by_d_type(self, db: Session, fk_document: int, type: str) -> Optional[Annot]:
        return (
            db.query(self.model)
            .filter(self.model.fk_document == fk_document)
            .filter(self.model.type == type)
            .all()
        )
        
    def get_all_by_type(self, db: Session, type: str) -> Optional[Annot]:
        return (
            db.query(self.model)
            .filter(self.model.type == type)
            .all()
        )

    def create(self, db: Session, *, obj_in: AnnotTopicIn, type: str, doc_id: int) -> Optional[Annot]:
        db_obj = self.model(
            external_id=obj_in.external_id,
            label=obj_in.data.label,
            type=type,
            description=obj_in.data.description,
            start_time=timedelta(seconds=obj_in.start),
            end_time=timedelta(seconds=obj_in.end),
            fk_document=doc_id
            )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    
annot = CRUDAnnot(Annot)
