from abc import ABC, abstractmethod
from typing import Optional
from modules.gateway.constants import DiscoveryProvider

class BaseServiceDiscovery(ABC):
    @abstractmethod
    def resolve_service(self, service_name: str) -> Optional[str]:
        pass

class StaticServiceDiscovery(BaseServiceDiscovery):
    """
    MVP Monolithic Discovery. Returns localhost for internal routing.
    """
    def resolve_service(self, service_name: str) -> Optional[str]:
        # In a monolith, everything is technically resolved internally by FastAPI router
        return "http://localhost:8000"

class ServiceDiscoveryEngine:
    def __init__(self, provider: DiscoveryProvider = DiscoveryProvider.STATIC):
        self.provider_type = provider
        if provider == DiscoveryProvider.STATIC:
            self._engine = StaticServiceDiscovery()
        else:
            raise NotImplementedError(f"Discovery provider {provider} not implemented yet.")
            
    def resolve(self, service_name: str) -> Optional[str]:
        return self._engine.resolve_service(service_name)

service_discovery_engine = ServiceDiscoveryEngine()
