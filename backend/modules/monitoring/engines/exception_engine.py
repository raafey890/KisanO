from typing import Any, Dict
import traceback
from modules.monitoring.engines.logging_engine import logging_engine
from modules.monitoring.constants import LogLevel

class ExceptionEngine:
    @staticmethod
    def capture_exception(exc: Exception, context_info: Dict[str, Any] = None):
        """
        Formats exception stacktraces for centralized logging.
        """
        payload = {
            "errorType": type(exc).__name__,
            "errorMessage": str(exc),
            "stackTrace": traceback.format_exc(),
            "context": context_info or {}
        }
        logging_engine.log(LogLevel.ERROR, "ExceptionEngine", f"Unhandled Exception: {str(exc)}", payload)

exception_engine = ExceptionEngine()
