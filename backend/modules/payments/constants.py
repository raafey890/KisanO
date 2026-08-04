from enum import Enum

class PaymentStatus(str, Enum):
    CREATED = "CREATED"
    PENDING = "PENDING"
    AUTHORIZED = "AUTHORIZED"
    CAPTURED = "CAPTURED"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"
    REFUND_PENDING = "REFUND_PENDING"
    REFUNDED = "REFUNDED"
    SETTLEMENT_PENDING = "SETTLEMENT_PENDING"
    SETTLED = "SETTLED"

class PaymentMethod(str, Enum):
    UPI = "UPI"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"
    NET_BANKING = "NET_BANKING"
    WALLET = "WALLET"
    EMI = "EMI"
    COD = "COD"

class PaymentType(str, Enum):
    EQUIPMENT_RENTAL = "EQUIPMENT_RENTAL"
    MARKETPLACE_ORDER = "MARKETPLACE_ORDER"
    SPRAYER_SERVICE = "SPRAYER_SERVICE"
    SUBSCRIPTION = "SUBSCRIPTION"
    WALLET_TOPUP = "WALLET_TOPUP"
    DONATION = "DONATION"

class RefundStatus(str, Enum):
    INITIATED = "INITIATED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REJECTED = "REJECTED"

class SettlementStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SETTLED = "SETTLED"
    FAILED = "FAILED"

# Finite State Machine for Payment Lifecycle
VALID_PAYMENT_TRANSITIONS = {
    PaymentStatus.CREATED: [PaymentStatus.PENDING, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
    PaymentStatus.PENDING: [PaymentStatus.AUTHORIZED, PaymentStatus.CAPTURED, PaymentStatus.FAILED, PaymentStatus.EXPIRED],
    PaymentStatus.AUTHORIZED: [PaymentStatus.CAPTURED, PaymentStatus.FAILED, PaymentStatus.CANCELLED],
    PaymentStatus.CAPTURED: [PaymentStatus.SUCCESS, PaymentStatus.FAILED],
    PaymentStatus.SUCCESS: [PaymentStatus.REFUND_PENDING, PaymentStatus.SETTLEMENT_PENDING],
    
    PaymentStatus.REFUND_PENDING: [PaymentStatus.REFUNDED, PaymentStatus.SUCCESS], # Can revert if refund fails
    PaymentStatus.SETTLEMENT_PENDING: [PaymentStatus.SETTLED, PaymentStatus.SUCCESS],
    
    PaymentStatus.FAILED: [],
    PaymentStatus.CANCELLED: [],
    PaymentStatus.EXPIRED: [],
    PaymentStatus.REFUNDED: [],
    PaymentStatus.SETTLED: []
}
