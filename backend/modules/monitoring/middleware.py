import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from modules.monitoring.context import set_request_id, set_correlation_id
from modules.monitoring.observability_engine import observability_engine
from modules.monitoring.constants import LogLevel

class ObservabilityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # 1. Generate / Extract IDs
        req_id = str(uuid.uuid4())
        corr_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        
        # 2. Inject into ContextVars
        set_request_id(req_id)
        set_correlation_id(corr_id)
        
        # 3. Start Timer
        start_time = time.time()
        
        try:
            # 4. Execute Request
            response = await call_next(request)
            
            # 5. Measure Latency
            process_time_ms = (time.time() - start_time) * 1000
            
            # 6. Log Success
            observability_engine.log(
                level=LogLevel.INFO,
                module="middleware",
                message="Request completed",
                endpoint=request.url.path,
                method=request.method,
                statusCode=response.status_code,
                executionTimeMs=round(process_time_ms, 2)
            )
            
            # Increment Metric
            observability_engine.increment_metric(
                "http_requests_total",
                labels={"method": request.method, "endpoint": request.url.path, "status": response.status_code}
            )
            
            # Inject Headers back to client
            response.headers["X-Request-ID"] = req_id
            response.headers["X-Correlation-ID"] = corr_id
            return response
            
        except Exception as e:
            # Handle unhandled exceptions gracefully
            process_time_ms = (time.time() - start_time) * 1000
            
            observability_engine.capture_exception(e, {
                "endpoint": request.url.path,
                "method": request.method
            })
            
            observability_engine.log(
                level=LogLevel.ERROR,
                module="middleware",
                message="Request failed with unhandled exception",
                endpoint=request.url.path,
                method=request.method,
                statusCode=500,
                executionTimeMs=round(process_time_ms, 2)
            )
            
            observability_engine.increment_metric(
                "http_requests_total",
                labels={"method": request.method, "endpoint": request.url.path, "status": 500}
            )
            raise e
