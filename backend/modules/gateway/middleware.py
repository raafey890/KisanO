from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from modules.gateway.gateway_engine import gateway_engine
from core.exceptions import AppException
import json
from starlette.responses import JSONResponse

class GatewayMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        try:
            # 1. Ingress Request Processing (Versioning, Tenants, Extraction)
            gateway_engine.process_request(request)
            
            # 2. Proceed to Business Logic / Routers
            response = await call_next(request)
            
            # 3. Egress Response Processing (Envelope injection, Headers)
            response = gateway_engine.process_response(response, request)
            return response
            
        except AppException as e:
            return JSONResponse(status_code=e.status_code, content={"success": False, "error": {"detail": e.detail}})
        except Exception as e:
            # Catchall for unhandled gateway failures
            return JSONResponse(status_code=500, content={"success": False, "error": {"detail": "Internal Gateway Error"}})
