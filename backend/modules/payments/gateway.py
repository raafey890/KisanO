from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
import uuid
import hmac
import hashlib

class BasePaymentGateway(ABC):
    @abstractmethod
    async def create_order(self, amount: float, currency: str, receipt: str) -> Dict[str, Any]:
        """Creates a payment order on the gateway."""
        pass

    @abstractmethod
    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verifies the authenticity of the webhook or success callback."""
        pass

    @abstractmethod
    async def issue_refund(self, payment_id: str, amount: float) -> Dict[str, Any]:
        """Issues a refund on the gateway."""
        pass

class MockRazorpayGateway(BasePaymentGateway):
    def __init__(self, secret: str = "mock_secret"):
        self.secret = secret

    async def create_order(self, amount: float, currency: str, receipt: str) -> Dict[str, Any]:
        """Simulates Razorpay order creation."""
        order_id = f"order_mock_{uuid.uuid4().hex[:12]}"
        return {
            "id": order_id,
            "entity": "order",
            "amount": int(amount * 100), # Razorpay uses paise
            "currency": currency,
            "receipt": receipt,
            "status": "created"
        }

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Simulates Razorpay signature verification."""
        # For mock purposes, if signature equals 'mock_signature_success', it passes.
        # Otherwise, we simulate the actual HMAC SHA256 logic (even if it's a mock).
        if signature == "mock_signature_success":
            return True
            
        payload = f"{order_id}|{payment_id}"
        expected_signature = hmac.new(
            self.secret.encode(), 
            payload.encode(), 
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_signature, signature)

    async def issue_refund(self, payment_id: str, amount: float) -> Dict[str, Any]:
        """Simulates Razorpay refund generation."""
        refund_id = f"rfnd_mock_{uuid.uuid4().hex[:12]}"
        return {
            "id": refund_id,
            "entity": "refund",
            "amount": int(amount * 100),
            "payment_id": payment_id,
            "status": "processed"
        }

# Dependency Injection Point
def get_payment_gateway() -> BasePaymentGateway:
    return MockRazorpayGateway()
