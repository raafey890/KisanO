"""
Razorpay Webhook Handler
Secure, idempotent webhook processing with real signature verification.
Falls back to mock verification when Razorpay credentials are not set.
"""
import json
import hmac
import hashlib
import logging
from typing import Dict
from datetime import datetime, timezone

from fastapi import Request

from core.config import settings
from core.exceptions import AppException
from modules.payments.repository import webhook_repository

logger = logging.getLogger(__name__)


class WebhookService:
    @staticmethod
    async def process_razorpay_webhook(request: Request) -> Dict[str, str]:
        """
        Secure, Idempotent Webhook Handler for Razorpay.
        Uses real signature verification when credentials are configured.
        """
        body = await request.body()
        signature = request.headers.get("x-razorpay-signature")

        if not signature:
            raise AppException("Missing webhook signature", 400)

        # --- Signature Verification ---
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

        if webhook_secret:
            # Real Razorpay HMAC-SHA256 verification
            expected_sig = hmac.new(
                webhook_secret.encode("utf-8"),
                body,
                hashlib.sha256,
            ).hexdigest()

            if not hmac.compare_digest(expected_sig, signature):
                logger.warning("[Webhook] Invalid Razorpay signature")
                raise AppException("Invalid webhook signature", 401)
        else:
            # Mock fallback for local dev
            if signature != "mock_signature_success":
                mock_secret = "mock_webhook_secret"
                expected_sig = hmac.new(
                    mock_secret.encode("utf-8"), body, hashlib.sha256
                ).hexdigest()
                if not hmac.compare_digest(expected_sig, signature):
                    raise AppException("Invalid webhook signature", 401)

        # --- Parse Payload ---
        payload = json.loads(body.decode("utf-8"))
        event_id = payload.get("id")
        event_type = payload.get("event")

        if not event_id:
            raise AppException("Missing event ID", 400)

        # 1. Idempotency Check
        if await webhook_repository.is_processed(event_id, "Razorpay"):
            return {"status": "already_processed"}

        # 2. Process Event
        try:
            if event_type == "payment.captured":
                entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
                gateway_order_id = entity.get("order_id")
                gateway_payment_id = entity.get("id")

                if gateway_order_id and gateway_payment_id:
                    logger.info(
                        f"[Webhook] payment.captured: order={gateway_order_id}, "
                        f"payment={gateway_payment_id}"
                    )
                    # TODO: Look up internal payment by gateway_order_id
                    # and call PaymentService.verify_payment() to complete the flow

            elif event_type == "payment.failed":
                entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
                logger.warning(
                    f"[Webhook] payment.failed: {entity.get('id')} - "
                    f"{entity.get('error_description', 'Unknown error')}"
                )

            elif event_type == "refund.processed":
                entity = payload.get("payload", {}).get("refund", {}).get("entity", {})
                logger.info(
                    f"[Webhook] refund.processed: {entity.get('id')} "
                    f"for payment {entity.get('payment_id')}"
                )

            elif event_type == "settlement.processed":
                logger.info(f"[Webhook] settlement.processed: {event_id}")

            # 3. Log Success
            await webhook_repository.create({
                "eventId": event_id,
                "provider": "Razorpay",
                "eventType": event_type,
                "payload": payload,
                "status": "PROCESSED",
                "processedAt": datetime.now(timezone.utc),
            })

            return {"status": "processed"}

        except Exception as e:
            # Log Failure
            await webhook_repository.create({
                "eventId": event_id,
                "provider": "Razorpay",
                "eventType": event_type,
                "payload": payload,
                "status": "FAILED",
                "error": str(e),
                "processedAt": datetime.now(timezone.utc),
            })
            raise AppException(f"Webhook processing failed: {str(e)}", 500)
