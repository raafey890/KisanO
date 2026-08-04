from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.orders.constants import OrderStatus, DeliveryStatus, PaymentStatus

# --- Immutable Snapshots ---

class AddressSnapshot(BaseModel):
    street: str
    village: Optional[str] = None
    district: str
    state: str
    pincode: str
    landmark: Optional[str] = None
    phone: str

class BuyerSnapshot(BaseModel):
    buyerId: str
    buyerName: str
    buyerPhone: str

class SellerSnapshot(BaseModel):
    sellerId: str
    sellerName: str
    businessName: Optional[str] = None

class ProductSnapshot(BaseModel):
    productId: str
    sku: str
    productName: str
    brand: str
    category: str
    weight: float
    unit: str
    coverImageUrl: Optional[str] = None

class PricingSnapshot(BaseModel):
    mrp: float
    sellingPrice: float
    discountPercentage: float

# --- Order Components ---

class OrderItemCreate(BaseModel):
    productId: str
    quantity: int = Field(..., gt=0)

class OrderItem(BaseModel):
    productSnapshot: ProductSnapshot
    pricingSnapshot: PricingSnapshot
    quantity: int
    lineTotal: float # sellingPrice * quantity
    lineTax: float = 0.0

# --- Request / Response Models ---

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shippingAddress: AddressSnapshot
    billingAddress: AddressSnapshot
    couponCode: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    orderNumber: str
    
    buyerSnapshot: BuyerSnapshot
    sellerSnapshot: SellerSnapshot # Assuming 1 order = 1 seller for MVP, if multi-seller cart, we'd split into sub-orders
    
    shippingAddress: AddressSnapshot
    billingAddress: AddressSnapshot
    
    items: List[OrderItem]
    
    subtotal: float
    discount: float
    couponCode: Optional[str]
    tax: float
    deliveryCharges: float
    finalAmount: float
    
    paymentStatus: PaymentStatus
    orderStatus: OrderStatus
    deliveryStatus: DeliveryStatus
    
    trackingNumber: Optional[str] = None
    estimatedDelivery: Optional[datetime] = None
    cancellationReason: Optional[str] = None
    
    notes: Optional[str] = None
    
    version: int
    createdAt: datetime
    updatedAt: datetime

class PaginatedOrderResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    skip: int
    limit: int

# --- Timeline ---

class OrderTimelineEvent(BaseModel):
    id: str
    orderId: str
    status: OrderStatus
    actorId: str
    actorRole: str
    notes: Optional[str] = None
    createdAt: datetime
