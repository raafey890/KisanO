from typing import Any, Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar('T')

class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: Optional[T] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: Optional[List[Any]] = None

def success_response(message: str, data: Any = None) -> SuccessResponse:
    """Standardize successful API responses."""
    return SuccessResponse(success=True, message=message, data=data)

def error_response(message: str, errors: List[Any] = None) -> ErrorResponse:
    """Standardize error API responses."""
    return ErrorResponse(success=False, message=message, errors=errors)
