import logging
from typing import Dict, Any, Callable, List

logger = logging.getLogger(__name__)

class EventPublisher:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type: str, handler: Callable):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)
        
    async def publish(self, event_type: str, payload: Dict[str, Any]):
        handlers = self._subscribers.get(event_type, [])
        for handler in handlers:
            try:
                await handler(payload)
            except Exception as e:
                logger.error(f"Error executing event handler for {event_type}: {str(e)}")

# This local event publisher forwards to the global bus.
support_events = EventPublisher()

class SupportDomainEvents:
    TICKET_CREATED = "TicketCreated"
    TICKET_ASSIGNED = "TicketAssigned"
    TICKET_ESCALATED = "TicketEscalated"
    TICKET_RESOLVED = "TicketResolved"
    TICKET_CLOSED = "TicketClosed"
    KNOWLEDGE_BASE_UPDATED = "KnowledgeBaseUpdated"
