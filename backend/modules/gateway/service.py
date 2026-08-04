from typing import Dict, Any
from modules.gateway.policies import policy_engine
from modules.gateway.routing import routing_engine
from modules.gateway.service_discovery import service_discovery_engine

class GatewayService:
    @staticmethod
    def get_gateway_status() -> Dict[str, Any]:
        return {
            "status": "UP",
            "maintenance_mode": policy_engine.is_maintenance_mode(),
            "service_discovery": service_discovery_engine.provider_type.value,
            "deprecated_versions": routing_engine.deprecated_versions
        }
