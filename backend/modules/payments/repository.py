from typing import Optional, Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from bson import ObjectId
import pymongo

class BasePaymentsRepository(BaseRepository):
    def __init__(self, collection_name: str, prefix: str):
        super().__init__(collection_name)
        self.prefix = prefix

    async def generate_number(self) -> str:
        """Generates sequential number e.g. PAY-2026-000001, REF-2026-000001"""
        year = datetime.now(timezone.utc).year
        count = await self.collection.count_documents({
            "createdAt": {
                "$gte": datetime(year, 1, 1, tzinfo=timezone.utc),
                "$lt": datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            }
        })
        sequence = str(count + 1).zfill(6)
        return f"{self.prefix}-{year}-{sequence}"

    async def soft_delete(self, doc_id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(doc_id)},
            {"$set": {"isDeleted": True, "updatedAt": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

class PaymentRepository(BasePaymentsRepository):
    def __init__(self):
        super().__init__("payments", prefix="PAY")

    async def setup_indexes(self):
        await self.collection.create_index("paymentNumber", unique=True)
        await self.collection.create_index("gatewaySnapshot.gatewayOrderId")
        await self.collection.create_index("referenceSnapshot.referenceId")
        await self.collection.create_index("payerSnapshot.userId")
        await self.collection.create_index("receiverSnapshot.receiverId")
        await self.collection.create_index("paymentStatus")

    async def create_payment(self, payment_data: Dict[str, Any]) -> str:
        payment_data["paymentNumber"] = await self.generate_number()
        payment_data["version"] = 1
        payment_data["isDeleted"] = False
        payment_data["createdAt"] = datetime.now(timezone.utc)
        payment_data["updatedAt"] = datetime.now(timezone.utc)
        
        res = await self.create(payment_data)
        return str(res["_id"])

    async def update_payment_optimistic(self, payment_id: str, current_version: int, update_data: Dict[str, Any]) -> bool:
        update_data["updatedAt"] = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(payment_id), "version": current_version, "isDeleted": False},
            {
                "$set": update_data,
                "$inc": {"version": 1}
            }
        )
        return result.modified_count > 0

class RefundRepository(BasePaymentsRepository):
    def __init__(self):
        super().__init__("refunds", prefix="REF")

    async def create_refund(self, data: Dict[str, Any]) -> str:
        data["refundNumber"] = await self.generate_number()
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        res = await self.create(data)
        return str(res["_id"])

class SettlementRepository(BasePaymentsRepository):
    def __init__(self):
        super().__init__("settlements", prefix="STL")

    async def create_settlement(self, data: Dict[str, Any]) -> str:
        data["settlementNumber"] = await self.generate_number()
        data["createdAt"] = datetime.now(timezone.utc)
        res = await self.create(data)
        return str(res["_id"])

class WebhookLogRepository(BaseRepository):
    def __init__(self):
        super().__init__("webhook_logs")

    async def is_processed(self, event_id: str, provider: str) -> bool:
        """Idempotency check"""
        count = await self.collection.count_documents({
            "eventId": event_id,
            "provider": provider,
            "status": "PROCESSED"
        })
        return count > 0

class PaymentAuditRepository(BaseRepository):
    def __init__(self):
        super().__init__("payment_audit_logs")

    async def log_action(self, payment_id: str, action: str, status: str, notes: Optional[str] = None):
        await self.create({
            "paymentId": payment_id,
            "action": action,
            "status": status,
            "notes": notes,
            "createdAt": datetime.now(timezone.utc)
        })


payment_repository = PaymentRepository()
refund_repository = RefundRepository()
settlement_repository = SettlementRepository()
webhook_repository = WebhookLogRepository()
audit_repository = PaymentAuditRepository()
