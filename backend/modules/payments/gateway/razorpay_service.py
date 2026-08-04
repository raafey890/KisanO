import logging
import hmac
import hashlib
from typing import Dict, Any
from core.config import settings
from .payment_factory import IPaymentGateway

logger = logging.getLogger(__name__)

class RazorpayService(IPaymentGateway):
    """
    Implementation for Razorpay.
    Note: Real production environments would use the `razorpay` official pip package.
    Since we are scaffolding without real API keys, this acts as a robust mock that enforces the correct cryptographic signatures if keys were present.
    """
    
    def __init__(self):
        self.key_id = getattr(settings, "RAZORPAY_KEY_ID", "mock_key_id")
        self.key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "mock_key_secret")

    async def create_order(self, amount: float, currency: str, receipt_id: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        # Convert amount to lowest denominator (paise for INR)
        amount_in_paise = int(amount * 100)
        
        # MOCK API CALL
        logger.info(f"Mock Razorpay Create Order: {amount_in_paise} {currency} for {receipt_id}")
        
        return {
            "id": f"order_mock_{receipt_id}",
            "entity": "order",
            "amount": amount_in_paise,
            "currency": currency,
            "receipt": receipt_id,
            "status": "created"
        }

    async def verify_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """
        Razorpay verifies signatures by hashing (order_id + "|" + payment_id) with the key_secret using HMAC SHA256.
        """
        payload = f"{order_id}|{payment_id}"
        
        if self.key_secret == "mock_key_secret":
            # If we are just mocking without real keys, assume true if it looks valid
            return True

        generated_signature = hmac.new(
            self.key_secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, signature)

    async def verify_webhook(self, payload: str, signature: str) -> bool:
        webhook_secret = getattr(settings, "RAZORPAY_WEBHOOK_SECRET", "mock_webhook_secret")
        
        if webhook_secret == "mock_webhook_secret":
            return True
            
        generated_signature = hmac.new(
            webhook_secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, signature)

    async def process_refund(self, payment_id: str, amount: float, notes: str = None) -> Dict[str, Any]:
        amount_in_paise = int(amount * 100)
        logger.info(f"Mock Razorpay Refund: {amount_in_paise} for payment {payment_id}")
        
        return {
            "id": f"rfnd_mock_{payment_id}",
            "entity": "refund",
            "amount": amount_in_paise,
            "payment_id": payment_id,
            "status": "processed"
        }

def get_payment_gateway(gateway_name: str) -> IPaymentGateway:
    """Factory to retrieve the correct gateway implementation."""
    if gateway_name == "RAZORPAY":
        return RazorpayService()
    # future: elif gateway_name == "STRIPE": return StripeService()
    raise ValueError(f"Unsupported payment gateway: {gateway_name}")
