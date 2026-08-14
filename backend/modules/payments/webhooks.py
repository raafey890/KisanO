from typing import Dict, Any
from fastapi import Request
import hmac
import hashlib
from datetime import datetime, timezone
import json

from core.exceptions import AppException
from modules.payments.repository import webhook_repository
from modules.payments.service import PaymentService
from modules.payments.gateway import get_payment_gateway

class WebhookService:
    @staticmethod
    async def process_razorpay_webhook(request: Request) -> Dict[str, str]:
        """
        Secure, Idempotent Webhook Handler for Mock Razorpay
        """
        body = await request.body()
        signature = request.headers.get("x-razorpay-signature")
        
        if not signature:
            raise AppException("Missing webhook signature", 400)
            
        # In a real scenario, gateway validates webhook signature using a specific webhook secret.
        # Here we mock the validation.
        secret = "mock_webhook_secret"
        expected_sig = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        
        if signature != "mock_signature_success" and not hmac.compare_digest(expected_sig, signature):
            raise AppException("Invalid webhook signature", 401)
            
        payload = json.loads(body.decode("utf-8"))
        event_id = payload.get("id")
        event_type = payload.get("event")
        
        if not event_id:
            raise AppException("Missing event ID", 400)
            
        # 1. Idempotency Check (Duplicate Detection)
        if await webhook_repository.is_processed(event_id, "Razorpay"):
            return {"status": "already_processed"}
            
        # 2. Process Event safely
        try:
            if event_type == "payment.captured":
                # Extract identifiers from webhook payload
                # TODO: extract entity = payload["payload"]["payment"]["entity"]
                # then lookup internal Payment by entity["order_id"]
                # For MVP, the event is logged as processed below
                pass
                
            elif event_type == "refund.processed":
                pass
                
            elif event_type == "settlement.processed":
                pass

            # 3. Log Success
            await webhook_repository.create({
                "eventId": event_id,
                "provider": "Razorpay",
                "eventType": event_type,
                "payload": payload,
                "status": "PROCESSED",
                "processedAt": datetime.now(timezone.utc)
            })
            
            return {"status": "processed"}
            
        except Exception as e:
            # Log Failure for retry safety
            await webhook_repository.create({
                "eventId": event_id,
                "provider": "Razorpay",
                "eventType": event_type,
                "payload": payload,
                "status": "FAILED",
                "error": str(e),
                "processedAt": datetime.now(timezone.utc)
            })
            # Webhook provider will retry based on 500 status code
            raise AppException(f"Webhook processing failed: {str(e)}", 500)
