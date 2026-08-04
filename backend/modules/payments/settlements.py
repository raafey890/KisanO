from typing import List, Dict, Any
from datetime import datetime, timezone
from modules.payments.repository import settlement_repository, payment_repository
from modules.payments.constants import SettlementStatus, PaymentStatus

class SettlementEngine:
    @staticmethod
    async def process_settlement(receiver_id: str, receiver_role: str, payment_ids: List[str]) -> str:
        """
        Processes a settlement for a receiver based on a list of successful payment IDs.
        Calculates the net settlement amount and generates a settlement record.
        """
        gross_amount = 0.0
        total_commission = 0.0
        total_gateway_charges = 0.0
        net_amount = 0.0
        
        # Verify payments and aggregate
        for pid in payment_ids:
            payment = await payment_repository.get_by_id(pid)
            if not payment or payment["paymentStatus"] != PaymentStatus.SUCCESS.value:
                continue
                
            pricing = payment["pricingSnapshot"]
            gross_amount += pricing["grossAmount"]
            total_commission += pricing["platformCommission"]
            total_gateway_charges += pricing["gatewayCharges"]
            net_amount += pricing["netAmount"]
            
            # Update payment status to SETTLEMENT_PENDING
            await payment_repository.update_payment_optimistic(
                str(payment["_id"]), 
                payment["version"], 
                {"paymentStatus": PaymentStatus.SETTLEMENT_PENDING.value}
            )

        settlement_doc = {
            "receiverId": receiver_id,
            "receiverRole": receiver_role,
            "paymentIds": payment_ids,
            "grossAmount": round(gross_amount, 2),
            "totalCommission": round(total_commission, 2),
            "totalGatewayCharges": round(total_gateway_charges, 2),
            "netSettlementAmount": round(net_amount, 2),
            "status": SettlementStatus.PENDING.value
        }
        
        settlement_id = await settlement_repository.create_settlement(settlement_doc)
        return settlement_id

    @staticmethod
    async def mark_settled(settlement_id: str) -> None:
        """Marks a settlement as completed (e.g. money transferred to bank account)"""
        # In a real system, this would be triggered by a bank webhook or admin action
        pass

settlement_engine = SettlementEngine()
