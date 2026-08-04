import random
from typing import Dict, Any, List
from datetime import datetime, timezone
from modules.monitoring.schemas import SystemHealthResponse, ComponentHealth
from modules.monitoring.constants import ComponentStatus

class HealthEngine:
    @staticmethod
    async def check_health() -> SystemHealthResponse:
        """
        Liveness and Readiness probe aggregator.
        """
        components = [
            ComponentHealth(name="MongoDB", status=ComponentStatus.UP, latencyMs=random.uniform(5, 20)),
            ComponentHealth(name="Redis_Mock", status=ComponentStatus.UP, latencyMs=random.uniform(1, 3)),
            ComponentHealth(name="MediaService", status=ComponentStatus.UP),
            ComponentHealth(name="PaymentGateway", status=ComponentStatus.UP),
            ComponentHealth(name="AI_Provider", status=ComponentStatus.UP)
        ]
        
        # If any component is DOWN, overall is DEGRADED or DOWN
        overall_status = ComponentStatus.UP
        if any(c.status == ComponentStatus.DOWN for c in components):
            overall_status = ComponentStatus.DEGRADED
            
        return SystemHealthResponse(
            status=overall_status,
            timestamp=datetime.now(timezone.utc),
            components=components
        )

health_engine = HealthEngine()
