"""
Razorpay Integration Service
Low-level wrapper around the Razorpay Python SDK.
Used by the payment gateway and webhook modules.
"""
import logging
from typing import Dict, Any, Optional

import razorpay

from core.config import settings

logger = logging.getLogger(__name__)

_client: Optional[razorpay.Client] = None


def get_razorpay_client() -> Optional[razorpay.Client]:
    """
    Lazily initialise and return the Razorpay SDK client.
    Returns None when credentials are missing (local dev).
    """
    global _client
    if _client is not None:
        return _client

    key_id = settings.RAZORPAY_KEY_ID
    key_secret = settings.RAZORPAY_KEY_SECRET

    if not key_id or not key_secret:
        logger.warning(
            "[RazorpayService] Credentials not set — "
            "operating in mock mode."
        )
        return None

    _client = razorpay.Client(auth=(key_id, key_secret))
    logger.info("[RazorpayService] Initialized Razorpay client")
    return _client


class RazorpayService:
    """
    Thin wrapper around the Razorpay SDK for the KisanO platform.
    """

    @staticmethod
    def create_order(
        amount_paise: int,
        currency: str = "INR",
        receipt: Optional[str] = None,
        notes: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a Razorpay order.

        Args:
            amount_paise: Amount in paise (₹100 = 10000 paise).
            currency: Currency code (default INR).
            receipt: Internal receipt/reference string.
            notes: Optional key-value metadata.

        Returns:
            Razorpay order dict with 'id', 'amount', 'status', etc.
        """
        client = get_razorpay_client()
        if not client:
            raise RuntimeError("Razorpay is not configured")

        order_data: Dict[str, Any] = {
            "amount": amount_paise,
            "currency": currency,
            "payment_capture": 1,  # auto-capture
        }
        if receipt:
            order_data["receipt"] = receipt
        if notes:
            order_data["notes"] = notes

        order = client.order.create(data=order_data)
        logger.info(
            f"[RazorpayService] Order created: {order['id']} "
            f"for ₹{amount_paise / 100:.2f}"
        )
        return order

    @staticmethod
    def verify_payment_signature(
        order_id: str,
        payment_id: str,
        signature: str,
    ) -> bool:
        """
        Verify the Razorpay payment signature (HMAC-SHA256).

        Args:
            order_id: The Razorpay order ID.
            payment_id: The Razorpay payment ID.
            signature: The signature from the frontend callback.

        Returns:
            True if signature is valid, False otherwise.
        """
        client = get_razorpay_client()
        if not client:
            raise RuntimeError("Razorpay is not configured")

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })
            logger.info(
                f"[RazorpayService] Signature verified for payment {payment_id}"
            )
            return True
        except razorpay.errors.SignatureVerificationError:
            logger.warning(
                f"[RazorpayService] Signature verification FAILED "
                f"for payment {payment_id}"
            )
            return False

    @staticmethod
    def verify_webhook_signature(
        body: bytes,
        signature: str,
        webhook_secret: Optional[str] = None,
    ) -> bool:
        """
        Verify a Razorpay webhook signature.

        Args:
            body: Raw request body bytes.
            signature: The x-razorpay-signature header value.
            webhook_secret: Override for the webhook secret.

        Returns:
            True if the webhook is authentic.
        """
        client = get_razorpay_client()
        if not client:
            raise RuntimeError("Razorpay is not configured")

        secret = webhook_secret or settings.RAZORPAY_WEBHOOK_SECRET
        if not secret:
            logger.warning("[RazorpayService] No webhook secret configured")
            return False

        try:
            client.utility.verify_webhook_signature(
                body.decode("utf-8"), signature, secret
            )
            return True
        except razorpay.errors.SignatureVerificationError:
            logger.warning("[RazorpayService] Webhook signature FAILED")
            return False

    @staticmethod
    def fetch_payment(payment_id: str) -> Dict[str, Any]:
        """Fetch payment details from Razorpay."""
        client = get_razorpay_client()
        if not client:
            raise RuntimeError("Razorpay is not configured")
        return client.payment.fetch(payment_id)

    @staticmethod
    def initiate_refund(
        payment_id: str,
        amount_paise: Optional[int] = None,
        notes: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Initiate a full or partial refund.

        Args:
            payment_id: Razorpay payment ID.
            amount_paise: Partial refund amount in paise. None = full refund.
            notes: Optional refund notes.

        Returns:
            Razorpay refund dict.
        """
        client = get_razorpay_client()
        if not client:
            raise RuntimeError("Razorpay is not configured")

        refund_data: Dict[str, Any] = {}
        if amount_paise is not None:
            refund_data["amount"] = amount_paise
        if notes:
            refund_data["notes"] = notes

        refund = client.payment.refund(payment_id, refund_data)
        logger.info(
            f"[RazorpayService] Refund initiated for {payment_id}: "
            f"{refund['id']}"
        )
        return refund


razorpay_service = RazorpayService()
