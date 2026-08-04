from typing import Dict, Any
from core.exceptions import AppException
from modules.payments.repository import refund_repository, payment_repository, audit_repository
from modules.payments.constants import RefundStatus, PaymentStatus
from modules.payments.gateway import get_payment_gateway

class RefundEngine:
    @staticmethod
    async def process_refund(payment_id: str, amount: float, reason: str) -> str:
        """
        Validates the payment, interacts with the gateway to issue a refund,
        and logs the refund document.
        """
        payment = await payment_repository.get_by_id(payment_id)
        if not payment:
            raise AppException("Payment not found for refund", 404)
            
        if payment["paymentStatus"] not in [PaymentStatus.SUCCESS.value, PaymentStatus.SETTLEMENT_PENDING.value]:
            raise AppException(f"Cannot refund a payment with status: {payment['paymentStatus']}", 400)
            
        if amount > payment["pricingSnapshot"]["grossAmount"]:
            raise AppException("Refund amount cannot exceed the gross payment amount", 400)
            
        # 1. Update Payment Status Optimistically
        success = await payment_repository.update_payment_optimistic(
            str(payment["_id"]), 
            payment["version"], 
            {"paymentStatus": PaymentStatus.REFUND_PENDING.value}
        )
        if not success:
            raise AppException("Concurrent payment update failed", 409)
            
        # 2. Call Gateway
        gateway = get_payment_gateway()
        gateway_resp = await gateway.issue_refund(payment["gatewaySnapshot"]["gatewayPaymentId"], amount)
        
        # 3. Create Refund Record
        refund_doc = {
            "paymentId": payment_id,
            "amount": amount,
            "reason": reason,
            "status": RefundStatus.PROCESSING.value, # Mock async refund processing
            "gatewayRefundId": gateway_resp["id"]
        }
        
        refund_id = await refund_repository.create_refund(refund_doc)
        
        await audit_repository.log_action(payment_id, "REFUND_INITIATED", RefundStatus.PROCESSING.value, reason)
        
        return refund_id

refund_engine = RefundEngine()
