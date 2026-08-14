from shared.booking_core.constants import BookingStatus, PaymentStatus, CompletionStatus

# Sprayer Booking FSM — defines which status transitions are permitted
VALID_BOOKING_TRANSITIONS = {
    BookingStatus.REQUESTED: [
        BookingStatus.ACCEPTED,
        BookingStatus.REJECTED,
        BookingStatus.CANCELLED,
    ],
    BookingStatus.ACCEPTED: [
        BookingStatus.PAYMENT_PENDING,
        BookingStatus.CANCELLED,
    ],
    BookingStatus.PAYMENT_PENDING: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
    ],
    BookingStatus.CONFIRMED: [
        BookingStatus.TRAVELING,
    ],
    BookingStatus.TRAVELING: [
        BookingStatus.WORK_STARTED,
    ],
    BookingStatus.WORK_STARTED: [
        BookingStatus.WORK_COMPLETED,
    ],
    BookingStatus.WORK_COMPLETED: [
        BookingStatus.COMPLETED,
        BookingStatus.DISPUTED,
    ],
    BookingStatus.COMPLETED: [],
    BookingStatus.REJECTED: [],
    BookingStatus.CANCELLED: [],
    BookingStatus.DISPUTED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
}

__all__ = ["BookingStatus", "PaymentStatus", "CompletionStatus",
           "VALID_BOOKING_TRANSITIONS"]
