import logging
from typing import Dict, Any, Callable, Optional

logger = logging.getLogger(__name__)

class PlatformWriteFacade:
    """
    Registry for Command patterns. Business modules register their approval/moderation handlers here.
    The Admin module executes commands blindly through this facade, preventing direct imports of Repositories.
    """
    def __init__(self):
        self._command_handlers: Dict[str, Callable] = {}

    def register_command(self, command_name: str, handler: Callable):
        self._command_handlers[command_name] = handler
        logger.info(f"Registered Admin Command: {command_name}")

    async def execute_command(self, command_name: str, payload: Dict[str, Any]) -> Any:
        handler = self._command_handlers.get(command_name)
        if not handler:
            raise NotImplementedError(f"No handler registered for command: {command_name}")
        return await handler(payload)


class PlatformReadFacade:
    """
    Registry for Read patterns (Analytics/Dashboard).
    """
    def __init__(self):
        self._read_handlers: Dict[str, Callable] = {}

    def register_reader(self, read_name: str, handler: Callable):
        self._read_handlers[read_name] = handler

    async def fetch(self, read_name: str, params: Dict[str, Any] = None) -> Any:
        handler = self._read_handlers.get(read_name)
        if not handler:
            return None # Fail gracefully for dashboard
        return await handler(params or {})

platform_write_facade = PlatformWriteFacade()
platform_read_facade = PlatformReadFacade()
