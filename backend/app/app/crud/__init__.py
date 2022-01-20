from .crud_user import user
from .crud_document import document
from .crud_project import project
from .crud_annot import annot
from .crud_topic_model import topic_model

"""
For a new basic set of CRUD operations you could just do:

    > from .base import CRUDBase
    > from app.models.item import Item
    > from app.schemas.item import ItemCreate, ItemUpdate

    > item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)
"""
