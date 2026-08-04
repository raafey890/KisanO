from enum import Enum

class OrderStatus(str, Enum):
    CREATED = "CREATED"
    PAYMENT_PENDING = "PAYMENT_PENDING"
    CONFIRMED = "CONFIRMED"
    PACKED = "PACKED"
    SHIPPED = "SHIPPED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"
    RETURN_REQUESTED = "RETURN_REQUESTED"
    RETURNED = "RETURNED"
    DISPUTED = "DISPUTED"

# Valid State Transitions
VALID_ORDER_TRANSITIONS = {
    OrderStatus.CREATED: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED, OrderStatus.REJECTED],
    OrderStatus.PAYMENT_PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    OrderStatus.CONFIRMED: [OrderStatus.PACKED, OrderStatus.CANCELLED],
    OrderStatus.PACKED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED], # Cancellation before shipment allowed
    OrderStatus.SHIPPED: [OrderStatus.OUT_FOR_DELIVERY], # Cannot cancel once shipped
    OrderStatus.OUT_FOR_DELIVERY: [OrderStatus.DELIVERED],
    OrderStatus.DELIVERED: [OrderStatus.COMPLETED, OrderStatus.RETURN_REQUESTED, OrderStatus.DISPUTED],
    OrderStatus.COMPLETED: [OrderStatus.RETURN_REQUESTED],
    OrderStatus.RETURN_REQUESTED: [OrderStatus.RETURNED, OrderStatus.COMPLETED, OrderStatus.DISPUTED],
    OrderStatus.CANCELLED: [],
    OrderStatus.REJECTED: [],
    OrderStatus.RETURNED: [],
    OrderStatus.DISPUTED: [OrderStatus.COMPLETED, OrderStatus.RETURNED, OrderStatus.CANCELLED]
}

class DeliveryStatus(str, Enum):
    PENDING = "PENDING"
    DISPATCHED = "DISPATCHED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    FAILED_ATTEMPT = "FAILED_ATTEMPT"
    RETURNED_TO_SENDER = "RETURNED_TO_SENDER"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUND_PENDING = "REFUND_PENDING"
    REFUNDED = "REFUNDED"
