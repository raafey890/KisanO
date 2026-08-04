from fastapi import APIRouter, Depends, status, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.orders.schemas import (
    OrderCreate, OrderResponse, PaginatedOrderResponse, OrderTimelineEvent
)
from modules.orders.service import OrderService
from modules.orders.constants import OrderStatus, PaymentStatus, DeliveryStatus
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole
from modules.orders.repository import timeline_repository

router = APIRouter()

@router.post(
    "",
    response_model=SuccessResponse[Dict[str, str]],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new order"
)
async def create_order(
    data: OrderCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.FARMER]))
):
    """
    Creates a new order from cart checkout. 
    Verifies inventory, decrements stock atomically, generates immutable snapshots of Buyer, Seller, Products, and Addresses.
    Initial status is set to CREATED.
    """
    order_id = await OrderService.create_order(str(current_user["_id"]), data)
    return success_response(message="Order created successfully", data={"id": order_id})


@router.get(
    "/{order_id}",
    response_model=SuccessResponse[OrderResponse],
    summary="Get order details"
)
async def get_order(
    order_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetch a complete order snapshot. Enforces RBAC so only the Seller, Buyer, or Admin can view.
    """
    order = await OrderService.get_order(order_id, str(current_user["_id"]), current_user["role"])
    return success_response(message="Order retrieved", data=order)


@router.patch(
    "/{order_id}/status",
    response_model=SuccessResponse[None],
    summary="Update order status"
)
async def update_status(
    order_id: str,
    new_status: OrderStatus,
    current_version: int = Query(...),
    notes: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Transition order status (e.g. PACKED, SHIPPED, CANCELLED).
    Enforces the strict FSM. Canceling or Rejecting automatically restores product inventory.
    """
    await OrderService.change_status(
        order_id, 
        str(current_user["_id"]), 
        current_user["role"], 
        new_status, 
        current_version, 
        notes
    )
    return success_response(message=f"Order status updated to {new_status.value}")


@router.get(
    "/{order_id}/timeline",
    response_model=SuccessResponse[List[OrderTimelineEvent]],
    summary="Get order timeline"
)
async def get_order_timeline(
    order_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Returns the chronologically ordered event history of the order.
    """
    # Enforce auth via get_order
    await OrderService.get_order(order_id, str(current_user["_id"]), current_user["role"])
    
    events = await timeline_repository.get_timeline(order_id)
    for e in events: e["id"] = str(e["_id"])
    return success_response(message="Timeline retrieved", data=events)


@router.get(
    "/query/search",
    response_model=SuccessResponse[PaginatedOrderResponse],
    summary="Search and filter orders"
)
async def search_orders(
    order_number: Optional[str] = Query(None),
    status: Optional[OrderStatus] = Query(None),
    payment_status: Optional[PaymentStatus] = Query(None),
    delivery_status: Optional[DeliveryStatus] = Query(None),
    sort: Optional[str] = Query("newest"),
    skip: int = 0,
    limit: int = 20,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Search orders. 
    - Admins see all. 
    - Sellers see orders where they are the seller snapshot. 
    - Buyers see orders where they are the buyer snapshot.
    """
    filters = {}
    if order_number: filters["orderNumber"] = order_number
    if status: filters["orderStatus"] = status.value
    if payment_status: filters["paymentStatus"] = payment_status.value
    if delivery_status: filters["deliveryStatus"] = delivery_status.value
    if sort: filters["sort"] = sort
    
    role = current_user["role"]
    if role == UserRole.FARMER:
        filters["buyerId"] = str(current_user["_id"])
    elif role == UserRole.SELLER:
        filters["sellerId"] = str(current_user["_id"])
    elif role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT_AGENT]:
        filters["buyerId"] = str(current_user["_id"]) # Fallback restrict

    items, total = await OrderService.search(filters, skip, limit)
    return success_response(message="Orders found", data={"items": items, "total": total, "skip": skip, "limit": limit})
