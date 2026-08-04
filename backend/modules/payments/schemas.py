from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from modules.payments.constants import PaymentStatus, PaymentMethod, PaymentType, RefundStatus, SettlementStatus

# --- Immutable Snapshots ---

class PayerSnapshot(BaseModel):
    userId: str
    userName: str
    phone: str

class ReceiverSnapshot(BaseModel):
    receiverId: str
    receiverName: str
    receiverRole: str # Seller, Equipment Owner, Sprayer Operator

class ReferenceSnapshot(BaseModel):
    referenceType: PaymentType
    referenceId: str
    description: str

class PricingSnapshot(BaseModel):
    grossAmount: float
    taxAmount: float
    platformCommission: float
    gatewayCharges: float
    netAmount: float
    currency: str = "INR"

class GatewaySnapshot(BaseModel):
    provider: str
    gatewayOrderId: str
    gatewayPaymentId: Optional[str] = None
    gatewaySignature: Optional[str] = None

# --- Main Payment Model ---

class PaymentCreate(BaseModel):
    paymentType: PaymentType
    referenceId: str
    payerId: str
    receiverId: str
    amount: float
    description: str

class PaymentResponse(BaseModel):
    id: str
    paymentNumber: str
    
    payerSnapshot: PayerSnapshot
    receiverSnapshot: ReceiverSnapshot
    referenceSnapshot: ReferenceSnapshot
    pricingSnapshot: PricingSnapshot
    gatewaySnapshot: GatewaySnapshot
    
    paymentStatus: PaymentStatus
    paymentMethod: Optional[PaymentMethod] = None
    
    version: int
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime

# --- Webhook & Audit Models ---

class WebhookLog(BaseModel):
    eventId: str
    provider: str
    eventType: str
    payload: Dict[str, Any]
    status: str
    processedAt: datetime

class PaymentAuditLog(BaseModel):
    paymentId: str
    action: str
    status: str
    notes: Optional[str] = None
    createdAt: datetime
    
# --- Refund & Settlement Models ---

class RefundCreate(BaseModel):
    paymentId: str
    amount: float
    reason: str

class RefundResponse(BaseModel):
    id: str
    refundNumber: str
    paymentId: str
    amount: float
    reason: str
    status: RefundStatus
    gatewayRefundId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

class SettlementResponse(BaseModel):
    id: str
    settlementNumber: str
    receiverId: str
    receiverRole: str
    paymentIds: List[str]
    grossAmount: float
    totalCommission: float
    totalGatewayCharges: float
    netSettlementAmount: float
    status: SettlementStatus
    settledAt: Optional[datetime] = None
    createdAt: datetime
