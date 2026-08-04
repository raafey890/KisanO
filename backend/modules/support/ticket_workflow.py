from modules.support.constants import TicketStatus
from core.exceptions import AppException

# Define allowed transitions from a specific state
ALLOWED_TRANSITIONS = {
    TicketStatus.OPEN: [TicketStatus.ASSIGNED, TicketStatus.CLOSED, TicketStatus.CANCELLED],
    TicketStatus.ASSIGNED: [TicketStatus.IN_PROGRESS, TicketStatus.WAITING_FOR_USER, TicketStatus.ESCALATED, TicketStatus.CLOSED],
    TicketStatus.IN_PROGRESS: [TicketStatus.WAITING_FOR_USER, TicketStatus.ESCALATED, TicketStatus.RESOLVED],
    TicketStatus.WAITING_FOR_USER: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED],
    TicketStatus.ESCALATED: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED],
    TicketStatus.RESOLVED: [TicketStatus.CLOSED, TicketStatus.REOPENED],
    TicketStatus.CLOSED: [TicketStatus.REOPENED],
    TicketStatus.REOPENED: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
    TicketStatus.CANCELLED: []
}

class TicketWorkflow:
    @staticmethod
    def validate_transition(current_status: str, new_status: str) -> bool:
        if new_status not in ALLOWED_TRANSITIONS.get(current_status, []):
            raise AppException(f"Invalid state transition from {current_status} to {new_status}")
        return True
