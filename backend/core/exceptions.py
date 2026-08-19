from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from shared.responses import error_response
from shared.error_codes import ErrorCode
import logging

logger = logging.getLogger(__name__)

class AppException(Exception):
    """Base exception for all custom application exceptions."""
    def __init__(self, message: str, status_code: int = 400, code: str = ErrorCode.UNKNOWN_ERROR.value, errors: list = None):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.errors = errors or []

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404, code=ErrorCode.ROUTE_NOT_FOUND.value)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message=message, status_code=401, code=ErrorCode.AUTH_UNAUTHORIZED.value)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message=message, status_code=403, code=ErrorCode.AUTH_FORBIDDEN.value)


async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=exc.message, code=exc.code, errors=exc.errors).model_dump()
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    errors = [{"loc": err["loc"], "msg": err["msg"], "type": err["type"]} for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content=error_response(message="Invalid input data. Please check the fields and try again.", code=ErrorCode.VALIDATION_ERROR.value, errors=errors).model_dump()
    )

async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle default FastAPI HTTP exceptions like 404 Not Found."""
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=exc.detail, code=ErrorCode.ROUTE_NOT_FOUND.value if exc.status_code == 404 else ErrorCode.UNKNOWN_ERROR.value).model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions."""
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=error_response(message="An unexpected system error occurred. Our team has been notified.", code=ErrorCode.INTERNAL_SERVER_ERROR.value).model_dump()
    )
