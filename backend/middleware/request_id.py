import uuid
from contextvars import ContextVar
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

request_id_contextvar: ContextVar[str] = ContextVar("request_id", default="")

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # Check if request ID is provided in headers, otherwise generate one
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        
        # Set the context variable
        token = request_id_contextvar.set(request_id)
        
        try:
            response = await call_next(request)
            # Inject request ID into response headers
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            request_id_contextvar.reset(token)
