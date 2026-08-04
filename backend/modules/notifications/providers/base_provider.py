from abc import ABC, abstractmethod
from typing import Dict, Any

class INotificationProvider(ABC):
    
    @abstractmethod
    async def send(self, recipient_id: str, title: str, message: str, data: Dict[str, Any] = None) -> bool:
        """Sends a notification through the provider."""
        pass
