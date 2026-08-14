import hmac
import hashlib
import uuid
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class RazorpayGateway:
    async def create_order(
        self,
        amount_in_inr: float,
        receipt_id: str,
        notes: Dict[str, str] = None
    ) -> Dict[str, Any]:
        """Mock Razorpay Order Creation."""
        logger.info(
            f"[MOCK] Creating Razorpay Order for amount INR {amount_in_inr}"
        )
        amount_in_paise = int(amount_in_inr * 100)
        return {
            "id": f"order_{uuid.uuid4().hex[:14]}",
            "entity": "order",
            "amount": amount_in_paise,
            "amount_paid": 0,
            "amount_due": amount_in_paise,
            "currency": "INR",
            "receipt": receipt_id,
            "status": "created",
            "attempts": 0,
            "notes": notes or {},
            "created_at": 1700000000,
        }

    async def verify_signature(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        signature: str
    ) -> bool:
        """Mock Webhook/Signature Verification. Returns True for testing."""
        logger.info(
            f"[MOCK] Verifying Razorpay signature for payment "
            f"{razorpay_payment_id}"
        )
        return True

    async def issue_refund(
        self, razorpay_payment_id: str, amount_in_inr: float
    ) -> Dict[str, Any]:
        """Mock Razorpay Refund."""
        logger.info(
            f"[MOCK] Issuing refund of INR {amount_in_inr} "
            f"for payment {razorpay_payment_id}"
        )
        return {
            "id": f"rfnd_{uuid.uuid4().hex[:14]}",
            "entity": "refund",
            "amount": int(amount_in_inr * 100),
            "currency": "INR",
            "payment_id": razorpay_payment_id,
            "status": "processed",
        }


class MockRazorpayGateway:
    """Synchronous mock gateway for unit-testing signature verification."""

    def __init__(self, secret: str):
        self.secret = secret

    def verify_signature(
        self,
        order_id: str,
        payment_id: str,
        signature: str
    ) -> bool:
        # Hardcoded bypass for test convenience
        if signature == "mock_signature_success":
            return True
        expected = hmac.new(
            self.secret.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)


razorpay_gateway = RazorpayGateway()
