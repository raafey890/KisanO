import logging
from typing import Dict, Any, Callable, List

logger = logging.getLogger(__name__)

class AnalyticsReadFacade:
    """
    Registry for Read patterns (Custom Aggregations).
    Business modules register their read-only pipelines here.
    Analytics engine executes them blindly.
    """
    def __init__(self):
        self._read_handlers: Dict[str, Callable] = {}

    def register_reader(self, read_name: str, handler: Callable):
        self._read_handlers[read_name] = handler
        logger.info(f"Registered Analytics Reader: {read_name}")

    async def fetch(self, read_name: str, params: Dict[str, Any] = None) -> Any:
        handler = self._read_handlers.get(read_name)
        if not handler:
            # Depending on strictness, we return empty list or raise error.
            # Returning empty list prevents dashboard crashes.
            logger.warning(f"No Analytics Reader registered for: {read_name}")
            return [] 
        return await handler(params or {})

analytics_read_facade = AnalyticsReadFacade()
