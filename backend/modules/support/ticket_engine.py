from core.exceptions import AppException
from modules.support.constants import TicketStatus, VALID_TICKET_TRANSITIONS

class TicketEngine:
    """
    Manages the Finite State Machine for a support ticket.
    """
    @staticmethod
    def validate_transition(current_status: TicketStatus, new_status: TicketStatus) -> bool:
        if current_status == new_status:
            return True
            
        allowed_transitions = VALID_TICKET_TRANSITIONS.get(current_status, [])
        if new_status not in allowed_transitions:
            raise AppException(f"Invalid transition from {current_status.value} to {new_status.value}.", 400)
            
        return True

ticket_engine = TicketEngine()
