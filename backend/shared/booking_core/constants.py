from enum import Enum

class BookingStatus(str, Enum):
    REQUESTED = "REQUESTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    PAYMENT_PENDING = "PAYMENT_PENDING"
    CONFIRMED = "CONFIRMED"
    
    # Equipment Specific
    IN_PROGRESS = "IN_PROGRESS"
    
    # Sprayer Specific
    TRAVELING = "TRAVELING"
    WORK_STARTED = "WORK_STARTED"
    WORK_COMPLETED = "WORK_COMPLETED"
    
    # Common final statuses
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"
    DISPUTED = "DISPUTED"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUND_PENDING = "REFUND_PENDING"
    REFUNDED = "REFUNDED"

class CompletionStatus(str, Enum):
    PENDING = "PENDING"
    OPERATOR_MARKED = "OPERATOR_MARKED"
    FARMER_CONFIRMED = "FARMER_CONFIRMED"
