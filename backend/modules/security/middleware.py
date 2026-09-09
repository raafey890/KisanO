from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        
        # Apply security headers; allow external assets for docs routes
        if request.url.path.startswith(('/docs', '/redoc', '/openapi.json')):
            # Permissive CSP for Swagger/Redoc UI (allows CDN scripts/styles)
            response.headers["Content-Security-Policy"] = (
                "default-src 'self' https://unpkg.com; "
                "script-src 'self' https://unpkg.com 'unsafe-inline'; "
                "style-src 'self' https://unpkg.com 'unsafe-inline'"
            )
        else:
            response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        
        return response
