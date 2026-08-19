"""
Payment Gateway - Strategy Pattern
Provides both a real Razorpay gateway and a mock gateway for testing.
The factory function decides which to use based on configuration.
"""
import logging
import uuid
import hmac
import hashlib
from abc import ABC, abstractmethod
from typing import Dict, Any

from core.config import settings

logger = logging.getLogger(__name__)


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


class RealRazorpayGateway(BasePaymentGateway):
    """
    Production Razorpay gateway using the real SDK.
    """

    def __init__(self):
        from integrations.razorpay_service import get_razorpay_client
        self._client = get_razorpay_client()
        if not self._client:
            raise RuntimeError(
                "Cannot create RealRazorpayGateway: credentials not configured"
            )

    async def create_order(self, amount: float, currency: str, receipt: str) -> Dict[str, Any]:
        """Create a real Razorpay order. Amount is in INR (rupees)."""
        amount_paise = int(amount * 100)
        order = self._client.order.create(data={
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt,
            "payment_capture": 1,
        })
        logger.info(f"[Razorpay] Order created: {order['id']} for ₹{amount:.2f}")
        return {
            "id": order["id"],
            "entity": "order",
            "amount": order["amount"],
            "currency": order["currency"],
            "receipt": receipt,
            "status": order["status"],
        }

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verify Razorpay payment callback signature."""
        try:
            self._client.utility.verify_payment_signature({
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })
            logger.info(f"[Razorpay] Signature verified for {payment_id}")
            return True
        except Exception:
            logger.warning(f"[Razorpay] Signature FAILED for {payment_id}")
            return False

    async def issue_refund(self, payment_id: str, amount: float) -> Dict[str, Any]:
        """Issue a real Razorpay refund."""
        amount_paise = int(amount * 100)
        refund_data = {}
        if amount_paise > 0:
            refund_data["amount"] = amount_paise

        refund = self._client.payment.refund(payment_id, refund_data)
        logger.info(f"[Razorpay] Refund {refund['id']} for payment {payment_id}")
        return {
            "id": refund["id"],
            "entity": "refund",
            "amount": refund["amount"],
            "payment_id": payment_id,
            "status": refund["status"],
        }


class MockRazorpayGateway(BasePaymentGateway):
    """Mock gateway for local development and testing."""

    def __init__(self, secret: str = "mock_secret"):
        self.secret = secret

    async def create_order(self, amount: float, currency: str, receipt: str) -> Dict[str, Any]:
        order_id = f"order_mock_{uuid.uuid4().hex[:12]}"
        return {
            "id": order_id,
            "entity": "order",
            "amount": int(amount * 100),
            "currency": currency,
            "receipt": receipt,
            "status": "created",
        }

    def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        if signature == "mock_signature_success":
            return True

        payload = f"{order_id}|{payment_id}"
        expected = hmac.new(
            self.secret.encode(), payload.encode(), hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    async def issue_refund(self, payment_id: str, amount: float) -> Dict[str, Any]:
        refund_id = f"rfnd_mock_{uuid.uuid4().hex[:12]}"
        return {
            "id": refund_id,
            "entity": "refund",
            "amount": int(amount * 100),
            "payment_id": payment_id,
            "status": "processed",
        }


# -------------------------------------------------------------------
# Factory — Dependency Injection Point
# -------------------------------------------------------------------
def get_payment_gateway() -> BasePaymentGateway:
    """
    Returns the real Razorpay gateway when credentials are configured,
    otherwise falls back to the mock gateway for local dev/tests.
    """
    key_id = settings.RAZORPAY_KEY_ID
    key_secret = settings.RAZORPAY_KEY_SECRET

    if key_id and key_secret:
        try:
            return RealRazorpayGateway()
        except RuntimeError:
            logger.warning("[PaymentGateway] Falling back to MockRazorpayGateway")

    return MockRazorpayGateway()
