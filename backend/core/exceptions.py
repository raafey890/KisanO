from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from shared.responses import error_response
import logging

logger = logging.getLogger(__name__)

class AppException(Exception):
    """Base exception for all custom application exceptions."""
    def __init__(self, message: str, status_code: int = 400, errors: list = None):
        self.message = message
        self.status_code = status_code
        self.errors = errors or []

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message=message, status_code=401)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message=message, status_code=403)


async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=exc.message, errors=exc.errors).model_dump()
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    errors = [{"loc": err["loc"], "msg": err["msg"], "type": err["type"]} for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content=error_response(message="Validation Error", errors=errors).model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions."""
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=error_response(message="Internal Server Error").model_dump()
    )
