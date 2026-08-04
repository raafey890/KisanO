import logging
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from middleware.request_id import request_id_contextvar

logger = logging.getLogger("api.request")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        
        # We can extract request id from context variable
        req_id = request_id_contextvar.get()
        
        # Create a log record adapter or just inject directly
        extra = {"request_id": req_id}
        
        logger.info(
            f"Incoming request: {request.method} {request.url.path}",
            extra=extra
        )
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.info(
                f"Request completed: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s",
                extra=extra
            )
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Request failed: {request.method} {request.url.path} - Error: {str(e)} - Time: {process_time:.4f}s",
                extra=extra,
                exc_info=True
            )
            raise
