import logging
from abc import ABC, abstractmethod
from typing import Dict, Any

logger = logging.getLogger(__name__)

class BaseAlertProvider(ABC):
    @abstractmethod
    async def send_alert(self, title: str, message: str, severity: str):
        pass

class ConsoleAlertProvider(BaseAlertProvider):
    async def send_alert(self, title: str, message: str, severity: str):
        logger.critical(f"ALERT [{severity}] {title}: {message}")

class AlertEngine:
    def __init__(self):
        # Defaulting to Console. Easy to swap to SlackProvider later via DI.
        self._provider = ConsoleAlertProvider()
        
    async def trigger_alert(self, title: str, message: str, severity: str = "CRITICAL"):
        await self._provider.send_alert(title, message, severity)

alert_engine = AlertEngine()
