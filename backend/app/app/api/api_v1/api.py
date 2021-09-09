from fastapi import APIRouter

from app.api.api_v1.endpoints import login, users
from app.api.api_v1.endpoints import filter as filter_
from app.api.api_v1.endpoints.docs import doc
from app.api.api_v1.endpoints.docs.transcribe import aws

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(doc.router, prefix="/docs", tags=["docs"])
api_router.include_router(filter_.router, prefix="/filter", tags=["filter"])