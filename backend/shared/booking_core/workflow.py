from typing import List, Dict, Optional
from core.exceptions import AppException
from shared.booking_core.constants import BookingStatus

class BookingWorkflow:
    def __init__(self, custom_transitions: Optional[Dict[BookingStatus, List[BookingStatus]]] = None):
        """
        Initializes the FSM. 
        If custom_transitions is provided, it completely overrides the default unified transition matrix.
        """
        # Unified base transitions covering both modules
        self.transitions = custom_transitions or {
            BookingStatus.REQUESTED: [
                BookingStatus.ACCEPTED, 
                BookingStatus.REJECTED, 
                BookingStatus.CANCELLED,
                BookingStatus.EXPIRED
            ],
            BookingStatus.ACCEPTED: [
                BookingStatus.PAYMENT_PENDING,
                BookingStatus.CANCELLED
            ],
            BookingStatus.PAYMENT_PENDING: [
                BookingStatus.CONFIRMED,
                BookingStatus.CANCELLED,
                BookingStatus.EXPIRED
            ],
            BookingStatus.CONFIRMED: [
                BookingStatus.TRAVELING, # Sprayer flow
                BookingStatus.IN_PROGRESS, # Equipment flow
                BookingStatus.CANCELLED
            ],
            BookingStatus.TRAVELING: [
                BookingStatus.WORK_STARTED,
                BookingStatus.CANCELLED
            ],
            BookingStatus.WORK_STARTED: [
                BookingStatus.WORK_COMPLETED,
                BookingStatus.DISPUTED
            ],
            BookingStatus.WORK_COMPLETED: [
                BookingStatus.COMPLETED,
                BookingStatus.DISPUTED
            ],
            BookingStatus.IN_PROGRESS: [
                BookingStatus.COMPLETED,
                BookingStatus.DISPUTED
            ],
            BookingStatus.COMPLETED: [
                BookingStatus.DISPUTED
            ],
            BookingStatus.REJECTED: [],
            BookingStatus.CANCELLED: [],
            BookingStatus.EXPIRED: [],
            BookingStatus.DISPUTED: [
                BookingStatus.COMPLETED,
                BookingStatus.CANCELLED
            ]
        }

    def validate_transition(self, current_status: BookingStatus, new_status: BookingStatus, is_admin: bool = False):
        """
        Validates if a transition is allowed. Admins can bypass FSM rules.
        """
        valid_next_states = self.transitions.get(current_status, [])
        if new_status not in valid_next_states:
            if not is_admin:
                raise AppException(f"Invalid booking transition from {current_status} to {new_status}", status_code=400)
            # Admin override is logged by the caller
            return True
        return True
