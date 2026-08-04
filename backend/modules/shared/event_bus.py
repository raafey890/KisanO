import logging
import asyncio
from typing import Dict, Any, Callable, List
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class BaseEventBus(ABC):
    @abstractmethod
    def subscribe(self, event_name: str, handler: Callable):
        pass

    @abstractmethod
    async def publish(self, event_name: str, payload: Dict[str, Any]):
        pass


class InMemoryEventBus(BaseEventBus):
    """
    In-memory Pub/Sub mechanism for decoupling modules.
    In production, this would be replaced by RabbitMQ/Kafka to allow scaling across microservices.
    """
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_name: str, handler: Callable):
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        self._subscribers[event_name].append(handler)
        logger.info(f"Subscribed to Event: {event_name}")

    async def publish(self, event_name: str, payload: Dict[str, Any]):
        logger.info(f"Publishing Event: {event_name}")
        handlers = self._subscribers.get(event_name, [])
        for handler in handlers:
            # Execute handlers asynchronously so the publisher isn't blocked
            asyncio.create_task(self._execute_handler(handler, event_name, payload))
            
    async def _execute_handler(self, handler: Callable, event_name: str, payload: Dict[str, Any]):
        try:
            await handler(payload)
        except Exception as e:
            logger.error(f"Error in event handler for {event_name}: {str(e)}")

# Global Singleton
global_event_bus = InMemoryEventBus()

class DomainEvents:
    # Booking
    BOOKING_CONFIRMED = "BookingConfirmed"
    
    # Payments
    PAYMENT_SUCCEEDED = "PaymentSucceeded"
    
    # Reviews
    REVIEW_CREATED = "ReviewCreated"
    
    # AI Plant Doctor
    DIAGNOSIS_COMPLETED = "DiagnosisCompleted"
    LOW_CONFIDENCE_DIAGNOSIS = "LowConfidenceDiagnosis"
