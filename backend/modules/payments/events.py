import logging
from typing import Dict, Any, Callable, List

logger = logging.getLogger(__name__)

class EventPublisher:
    """
    A simple in-memory event publisher to decouple the Payments module from other domains.
    In a true distributed microservices architecture, this would publish to Kafka, RabbitMQ, or AWS EventBridge.
    """
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
                # Fire and forget (or await if async)
                await handler(payload)
            except Exception as e:
                logger.error(f"Error executing event handler for {event_type}: {str(e)}")

payment_events = EventPublisher()

# Pre-defined domain events
class PaymentEvents:
    PAYMENT_SUCCEEDED = "PaymentSucceeded"
    PAYMENT_FAILED = "PaymentFailed"
    REFUND_COMPLETED = "RefundCompleted"
    SETTLEMENT_COMPLETED = "SettlementCompleted"
