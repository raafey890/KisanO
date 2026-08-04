from fastapi import APIRouter, Depends, Query, Request
from typing import Dict, Any, List
from modules.auth.dependencies import get_current_user_id, get_current_user_role
from modules.payments.schemas import PaymentCreate, PaymentResponse, RefundCreate, RefundResponse, SettlementResponse
from modules.payments.service import PaymentService
from modules.payments.refunds import refund_engine
from modules.payments.settlements import settlement_engine
from modules.payments.webhooks import WebhookService

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

@router.post("/create", response_model=Dict[str, str])
async def create_payment(
    data: PaymentCreate,
    user_id: str = Depends(get_current_user_id)
):
    payment_id = await PaymentService.create_payment(data)
    return {"paymentId": payment_id}

@router.post("/verify")
async def verify_payment(
    payment_id: str,
    gateway_payment_id: str,
    signature: str,
    user_id: str = Depends(get_current_user_id)
):
    await PaymentService.verify_payment(payment_id, gateway_payment_id, signature)
    return {"message": "Payment verified successfully"}

@router.post("/refund", response_model=Dict[str, str])
async def issue_refund(
    data: RefundCreate,
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    # Only Admin or System can issue refunds in MVP
    if user_role not in ["Admin", "SuperAdmin", "System"]:
        from core.exceptions import UnauthorizedException
        raise UnauthorizedException("Only Admin can issue refunds")
        
    refund_id = await refund_engine.process_refund(data.paymentId, data.amount, data.reason)
    return {"refundId": refund_id}

@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request):
    """
    Public webhook endpoint. Security relies on X-Razorpay-Signature header.
    """
    result = await WebhookService.process_razorpay_webhook(request)
    return result

@router.get("", response_model=Dict[str, Any])
async def search_payments(
    payerId: str = None,
    receiverId: str = None,
    status: str = None,
    type: str = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    filters = {}
    
    # Enforce RBAC
    if user_role in ["Farmer"]:
        filters["payerId"] = user_id
    elif user_role in ["EquipmentOwner", "SprayerOperator", "Seller"]:
        filters["receiverId"] = user_id
        # Note: They could also be a payer. We'd need an $or query for complex roles, 
        # but sticking to simple RBAC for MVP.
        
    if payerId and user_role in ["Admin", "SuperAdmin"]: filters["payerId"] = payerId
    if receiverId and user_role in ["Admin", "SuperAdmin"]: filters["receiverId"] = receiverId
    if status: filters["status"] = status
    if type: filters["type"] = type
        
    items, total = await PaymentService.search(filters, skip, limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: str,
    user_id: str = Depends(get_current_user_id),
    user_role: str = Depends(get_current_user_role)
):
    return await PaymentService.get_payment(payment_id, user_id, user_role)
