from abc import ABC, abstractmethod
from typing import Dict, Any

class IPaymentGateway(ABC):
    
    @abstractmethod
    async def create_order(self, amount: float, currency: str, receipt_id: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Creates a payment order with the gateway. Returns gateway order payload."""
        pass
        
    @abstractmethod
    async def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verifies the authenticity of the payment signature."""
        pass
        
    @abstractmethod
    async def verify_webhook(self, payload: str, signature: str) -> bool:
        """Verifies the webhook payload signature."""
        pass

    @abstractmethod
    async def process_refund(self, payment_id: str, amount: float, notes: str = None) -> Dict[str, Any]:
        """Initiates a refund with the gateway."""
        pass
