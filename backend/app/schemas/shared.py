from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional, List, Any

T = TypeVar('T')

class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Page number starting from 1")
    limit: int = Field(default=10, ge=1, le=100, description="Items per page")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[Any] = None
