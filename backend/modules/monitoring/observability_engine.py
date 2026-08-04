import logging
from typing import Dict, Any, Optional
from modules.monitoring.constants import LogLevel
from modules.monitoring.engines.logging_engine import logging_engine
from modules.monitoring.engines.tracing_engine import tracing_engine
from modules.monitoring.engines.metrics_engine import metrics_engine
from modules.monitoring.engines.health_engine import health_engine
from modules.monitoring.engines.alert_engine import alert_engine
from modules.monitoring.engines.audit_engine import audit_engine
from modules.monitoring.engines.exception_engine import exception_engine
from modules.monitoring.schemas import SystemHealthResponse

logger = logging.getLogger(__name__)

class ObservabilityEngine:
    """
    Unified Orchestrator for the Monitoring Module.
    Business modules interact strictly with this interface.
    """
    
    @staticmethod
    def log(level: LogLevel, module: str, message: str, payload: Optional[Dict[str, Any]] = None, **kwargs):
        logging_engine.log(level, module, message, payload, **kwargs)
        
    @staticmethod
    async def log_audit(action: str, resource_type: str, resource_id: str, payload: Dict[str, Any]):
        await audit_engine.log_audit_event(action, resource_type, resource_id, payload)

    @staticmethod
    def increment_metric(name: str, value: float = 1.0, labels: dict = None):
        metrics_engine.increment_counter(name, value, labels)

    @staticmethod
    def capture_exception(exc: Exception, context_info: Dict[str, Any] = None):
        exception_engine.capture_exception(exc, context_info)

    @staticmethod
    async def check_health() -> SystemHealthResponse:
        return await health_engine.check_health()
        
    @staticmethod
    def start_trace(name: str):
        return tracing_engine.start_span(name)

    @staticmethod
    async def trigger_alert(title: str, message: str, severity: str = "CRITICAL"):
        await alert_engine.trigger_alert(title, message, severity)

observability_engine = ObservabilityEngine()
