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

review_events = EventPublisher()

class ReviewDomainEvents:
    REVIEW_CREATED = "ReviewCreated"
    REVIEW_UPDATED = "ReviewUpdated"
    REVIEW_DELETED = "ReviewDeleted"
    REVIEW_REPORTED = "ReviewReported"
    HELPFUL_VOTE_ADDED = "HelpfulVoteAdded"
    REPUTATION_UPDATED = "ReputationUpdated"
