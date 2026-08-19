import logging
from typing import Dict, Any, List
from core.exceptions import NotFoundException, AppException, UnauthorizedException

from modules.payments.repository import payment_repository, audit_repository
from modules.payments.schemas import PaymentCreate
from modules.payments.constants import PaymentStatus, VALID_PAYMENT_TRANSITIONS, PaymentMethod
from modules.payments.commissions import commission_engine
from modules.payments.gateway import get_payment_gateway
from modules.payments.events import payment_events, PaymentEvents
from modules.users.repository import user_repository

logger = logging.getLogger(__name__)

class PaymentService:
    @staticmethod
    async def create_payment(data: PaymentCreate) -> str:
        """
        Calculates commissions, generates a gateway order, and stores a PENDING payment.
        """
        # Fetch Payer and Receiver snapshots
        payer = await user_repository.get_by_id(data.payerId)
        if not payer:
            raise NotFoundException("Payer not found")
            
        receiver = await user_repository.get_by_id(data.receiverId)
        if not receiver:
            raise NotFoundException("Receiver not found")
            
        payer_snapshot = {
            "userId": str(payer["_id"]),
            "userName": payer.get("fullName", "Unknown"),
            "phone": payer.get("phone", "")
        }
        
        receiver_snapshot = {
            "receiverId": str(receiver["_id"]),
            "receiverName": receiver.get("fullName", "Unknown"),
            "receiverRole": receiver.get("role", "Unknown")
        }
        
        # Calculate Pricing and Commissions
        platform_fee, gateway_fee, taxes, net_amount = commission_engine.calculate_pricing(data.paymentType, data.amount)
        
        pricing_snapshot = {
            "grossAmount": data.amount,
            "taxAmount": taxes,
            "platformCommission": platform_fee,
            "gatewayCharges": gateway_fee,
            "netAmount": net_amount,
            "currency": "INR"
        }
        
        # Initialize Gateway
        gateway = get_payment_gateway()
        receipt = f"rcpt_{data.referenceId}"
        order = await gateway.create_order(data.amount, "INR", receipt)
        
        gateway_snapshot = {
            "provider": "Razorpay",
            "gatewayOrderId": order["id"]
        }
        
        reference_snapshot = {
            "referenceType": data.paymentType.value,
            "referenceId": data.referenceId,
            "description": data.description
        }
        
        # Build Document
        payment_doc = {
            "payerSnapshot": payer_snapshot,
            "receiverSnapshot": receiver_snapshot,
            "referenceSnapshot": reference_snapshot,
            "pricingSnapshot": pricing_snapshot,
            "gatewaySnapshot": gateway_snapshot,
            "paymentStatus": PaymentStatus.CREATED.value,
            "paymentMethod": None
        }
        
        payment_id = await payment_repository.create_payment(payment_doc)
        
        # Transition to Pending (Waiting for user to pay on UI)
        await PaymentService.change_status(payment_id, PaymentStatus.PENDING, "Payment order created")
        
        return payment_id

    @staticmethod
    async def get_payment(payment_id: str, user_id: str, user_role: str) -> Dict[str, Any]:
        payment = await payment_repository.get_by_id(payment_id)
        if not payment:
            raise NotFoundException("Payment not found")
            
        is_admin = user_role in ["Admin", "SuperAdmin"]
        is_payer = payment["payerSnapshot"]["userId"] == user_id
        is_receiver = payment["receiverSnapshot"]["receiverId"] == user_id
        
        if not (is_admin or is_payer or is_receiver):
            raise UnauthorizedException("You do not have permission to view this payment.")
            
        payment["id"] = str(payment["_id"])
        return payment

    @staticmethod
    async def change_status(payment_id: str, new_status: PaymentStatus, notes: str = None) -> None:
        """Internal service to safely change FSM status"""
        payment = await payment_repository.get_by_id(payment_id)
        current_status = PaymentStatus(payment["paymentStatus"])
        
        if new_status not in VALID_PAYMENT_TRANSITIONS.get(current_status, []):
            raise AppException(f"Invalid payment transition from {current_status} to {new_status}", status_code=400)
            
        success = await payment_repository.update_payment_optimistic(
            str(payment["_id"]), 
            payment["version"], 
            {"paymentStatus": new_status.value}
        )
        if not success:
            raise AppException("Status change failed due to version conflict.", status_code=409)
            
        await audit_repository.log_action(payment_id, f"STATUS_{new_status.value}", new_status.value, notes)

    @staticmethod
    async def verify_payment(payment_id: str, gateway_payment_id: str, signature: str) -> None:
        """
        Called when the frontend returns the gateway success tokens.
        """
        payment = await payment_repository.get_by_id(payment_id)
        if not payment:
            raise NotFoundException("Payment not found")
            
        if payment["paymentStatus"] != PaymentStatus.PENDING.value:
            raise AppException("Payment is not in pending state", 400)
            
        gateway = get_payment_gateway()
        is_valid = gateway.verify_signature(
            payment["gatewaySnapshot"]["gatewayOrderId"], 
            gateway_payment_id, 
            signature
        )
        
        if not is_valid:
            await PaymentService.change_status(payment_id, PaymentStatus.FAILED, "Signature verification failed")
            raise AppException("Payment signature verification failed", 400)
            
        # Update Gateway Snapshot
        new_snapshot = payment["gatewaySnapshot"]
        new_snapshot["gatewayPaymentId"] = gateway_payment_id
        new_snapshot["gatewaySignature"] = signature
        
        # Use MongoDB Transaction
        from db.mongodb import db_manager
        async with await db_manager.client.start_session() as session:
            async with session.start_transaction():
                # Perform Update
                success = await payment_repository.collection.update_one(
                    {"_id": payment["_id"], "version": payment["version"]},
                    {"$set": {
                        "gatewaySnapshot": new_snapshot,
                        "paymentMethod": PaymentMethod.UPI.value, # Mock assuming UPI
                        "paymentStatus": PaymentStatus.SUCCESS.value
                    }, "$inc": {"version": 1}},
                    session=session
                )
                if success.modified_count == 0:
                    raise AppException("Concurrency conflict while verifying payment", 409)
                    
                await audit_repository.collection.insert_one({
                    "paymentId": payment_id,
                    "action": "VERIFICATION_SUCCESS",
                    "status": PaymentStatus.SUCCESS.value,
                    "notes": "Payment verified via API",
                    "timestamp": __import__('datetime').datetime.utcnow()
                }, session=session)
        
        
        # Publish Domain Event for other modules to consume
        await payment_events.publish(PaymentEvents.PAYMENT_SUCCEEDED, {
            "paymentId": payment_id,
            "referenceId": payment["referenceSnapshot"]["referenceId"],
            "referenceType": payment["referenceSnapshot"]["referenceType"]
        })

    @staticmethod
    async def search(filters: Dict[str, Any], skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        query = {}
        if "payerId" in filters: query["payerSnapshot.userId"] = filters["payerId"]
        if "receiverId" in filters: query["receiverSnapshot.receiverId"] = filters["receiverId"]
        if "status" in filters: query["paymentStatus"] = filters["status"]
        if "type" in filters: query["referenceSnapshot.referenceType"] = filters["type"]
            
        cursor = payment_repository.collection.find(query).sort("createdAt", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        for i in items: i["id"] = str(i["_id"])
        total = await payment_repository.collection.count_documents(query)
        return items, total
