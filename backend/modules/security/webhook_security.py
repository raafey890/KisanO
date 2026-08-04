import hmac
import hashlib
import time
from fastapi import Request
from core.exceptions import AppException
import logging

logger = logging.getLogger(__name__)

class WebhookSecurityEngine:
    @staticmethod
    async def verify_signature(request: Request, secret: str, signature_header: str = "x-webhook-signature", timestamp_header: str = "x-webhook-timestamp"):
        signature = request.headers.get(signature_header)
        timestamp_str = request.headers.get(timestamp_header)

        if not signature or not timestamp_str:
            raise AppException(status_code=401, detail="Missing webhook signature or timestamp")

        # Replay protection: Reject if older than 5 minutes
        try:
            timestamp = int(timestamp_str)
            if time.time() - timestamp > 300:
                raise AppException(status_code=401, detail="Webhook timestamp expired (replay attack protection)")
        except ValueError:
            raise AppException(status_code=400, detail="Invalid timestamp format")

        body = await request.body()
        payload = f"{timestamp}.{body.decode('utf-8')}"
        
        expected_sig = hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, signature):
            logger.warning(f"Webhook signature mismatch from IP {request.client.host}")
            raise AppException(status_code=401, detail="Invalid webhook signature")

webhook_security_engine = WebhookSecurityEngine()
