from fastapi import Request
from core.exceptions import UnauthorizedException, AppException
import logging

logger = logging.getLogger(__name__)

class ApiKeyEngine:
    @staticmethod
    async def validate_api_key_usage(request: Request, api_key: str):
        """
        Delegates the physical key validation to SecurityEngine.
        Handles Gateway-level usage tracking and quotas.
        """
        # In a real environment, this calls SecurityEngine to verify the key exists.
        # MVP Placeholder:
        if api_key == "invalid":
            raise UnauthorizedException("Invalid API Key")
            
        # Check quota via Redis/CacheEngine
        # Increment usage metric
        logger.info(f"API Key usage logged for key signature {api_key[:5]}...")

api_key_engine = ApiKeyEngine()
