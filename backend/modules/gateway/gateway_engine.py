from fastapi import Request, Response
from modules.gateway.versioning import versioning_engine
from modules.gateway.request_transformer import request_transformer
from modules.gateway.response_transformer import response_transformer
from modules.gateway.api_keys import api_key_engine
from modules.gateway.policies import policy_engine
from modules.gateway.routing import routing_engine
from modules.gateway.traffic_manager import traffic_manager
from modules.gateway.service_discovery import service_discovery_engine
from core.exceptions import AppException
import logging

logger = logging.getLogger(__name__)

class GatewayEngine:
    """
    Unified Facade for API Gateway & Traffic Management.
    """

    @staticmethod
    def process_request(request: Request):
        if policy_engine.is_maintenance_mode():
            raise AppException(status_code=503, detail="Service under maintenance")

        meta = request_transformer.extract_metadata(request)

        if routing_engine.is_route_deprecated(meta.version):
            logger.warning(f"Deprecated API version {meta.version} accessed by {meta.client_ip}")

        # In a microservices architecture, this is where we'd resolve the downstream host
        # downstream = service_discovery_engine.resolve("auth_service")

    @staticmethod
    async def process_api_key(request: Request, api_key: str):
        await api_key_engine.validate_api_key_usage(request, api_key)

    @staticmethod
    def process_response(response: Response, request: Request) -> Response:
        meta = getattr(request.state, "gateway_meta", None)
        if meta:
            return response_transformer.envelope_response(response, meta)
        return response

gateway_engine = GatewayEngine()
