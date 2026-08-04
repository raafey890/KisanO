from enum import Enum

class TicketStatus(str, Enum):
    CREATED = "CREATED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    WAITING_FOR_CUSTOMER = "WAITING_FOR_CUSTOMER"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"
    ESCALATED = "ESCALATED"
    CANCELLED = "CANCELLED"

class TicketPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class TicketSeverity(str, Enum):
    MINOR = "MINOR"
    MAJOR = "MAJOR"
    CRITICAL = "CRITICAL"
    BLOCKER = "BLOCKER"

class SupportCategory(str, Enum):
    EQUIPMENT_ISSUES = "EQUIPMENT_ISSUES"
    BOOKING_ISSUES = "BOOKING_ISSUES"
    MARKETPLACE_ORDERS = "MARKETPLACE_ORDERS"
    PAYMENTS = "PAYMENTS"
    REFUNDS = "REFUNDS"
    AI_PLANT_DOCTOR = "AI_PLANT_DOCTOR"
    ACCOUNT_PROBLEMS = "ACCOUNT_PROBLEMS"
    TECHNICAL_ISSUES = "TECHNICAL_ISSUES"
    BUG_REPORTS = "BUG_REPORTS"
    FEATURE_REQUESTS = "FEATURE_REQUESTS"
    GENERAL_QUERIES = "GENERAL_QUERIES"

class CommentVisibility(str, Enum):
    PUBLIC = "PUBLIC"    # Visible to customer
    INTERNAL = "INTERNAL"  # Only visible to Support Agents / Admins

# The globally allowed state transitions for the Ticket FSM
VALID_TICKET_TRANSITIONS = {
    TicketStatus.CREATED: [TicketStatus.ASSIGNED, TicketStatus.CANCELLED],
    TicketStatus.ASSIGNED: [TicketStatus.IN_PROGRESS, TicketStatus.ESCALATED],
    TicketStatus.IN_PROGRESS: [TicketStatus.WAITING_FOR_CUSTOMER, TicketStatus.RESOLVED, TicketStatus.ESCALATED],
    TicketStatus.WAITING_FOR_CUSTOMER: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED],
    TicketStatus.RESOLVED: [TicketStatus.CLOSED, TicketStatus.REOPENED],
    TicketStatus.CLOSED: [TicketStatus.REOPENED],
    TicketStatus.REOPENED: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS],
    TicketStatus.ESCALATED: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED],
    TicketStatus.CANCELLED: []
}
