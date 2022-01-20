from typing import Any, Dict, Optional, List

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.topic_model import TopicModel
from app.models.topic_word import TopicWord
from app.schemas.visuals import (
    TopicModelCreate,
    TopicModelUpdate,
)


class CRUDTopicModel(CRUDBase[TopicModel, TopicModelCreate, TopicModelUpdate]):
    def get_all_by_mn(self, db: Session, project_id: int, model_name: str) -> Optional[TopicModel]:
        return (
            db.query(self.model)
            .filter(self.model.fk_project == project_id)
            .filter(self.model.model_name == model_name)
            .all()
        )
    
    def get_by_pid(self, db: Session, project_id: int, id: int) -> Optional[TopicModel]:
        return ( 
            db.query(self.model)
            .filter(self.model.fk_project == project_id)
            .filter(self.model.id == id)
            .first() 
            )

    def create(self, db: Session, *, obj_in: TopicModelCreate) -> TopicModel:
        obj_in_data = jsonable_encoder(obj_in)
        words = obj_in_data.pop("words", None)
        db_obj = self.model(**obj_in_data)  # type: ignore
        
        db_obj.words = [] 
        for word in words:
            db_obj.words.append(TopicWord(**word))

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


topic_model = CRUDTopicModel(TopicModel)