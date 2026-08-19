import logging
import json
import sys
import os
import traceback
from datetime import datetime, timezone
from typing import Any


class JSONFormatter(logging.Formatter):
    """
    Structured JSON log formatter — compatible with:
      - Loki (Grafana)
      - ELK Stack (Elasticsearch / Logstash / Kibana)
      - Google Cloud Logging
      - AWS CloudWatch
      - Datadog
    """

    # Enrich with these standard fields on every log record
    STATIC_FIELDS = {
        "app": os.getenv("APP_NAME", "kisano-backend"),
        "environment": os.getenv("ENVIRONMENT", "development"),
    }

    def format(self, record: logging.LogRecord) -> str:
        # --- Base structured fields ---
        log_record: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # --- Inject static deployment context ---
        log_record.update(self.STATIC_FIELDS)

        # --- Request correlation (set via middleware) ---
        if hasattr(record, "request_id"):
            log_record["request_id"] = record.request_id
        if hasattr(record, "user_id"):
            log_record["user_id"] = record.user_id
        if hasattr(record, "path"):
            log_record["path"] = record.path
        if hasattr(record, "method"):
            log_record["method"] = record.method
        if hasattr(record, "status_code"):
            log_record["status_code"] = record.status_code
        if hasattr(record, "duration_ms"):
            log_record["duration_ms"] = record.duration_ms

        # --- Exception details ---
        if record.exc_info:
            log_record["exception"] = {
                "type": record.exc_info[0].__name__ if record.exc_info[0] else None,
                "message": str(record.exc_info[1]) if record.exc_info[1] else None,
                "traceback": self.formatException(record.exc_info),
            }

        # --- Extra fields passed as kwargs to logger ---
        for key, value in record.__dict__.items():
            if key not in (
                "args", "asctime", "created", "exc_info", "exc_text",
                "filename", "funcName", "id", "levelname", "levelno",
                "lineno", "module", "msecs", "message", "msg", "name",
                "pathname", "process", "processName", "relativeCreated",
                "stack_info", "thread", "threadName",
            ) and not key.startswith("_") and key not in log_record:
                log_record[key] = value

        return json.dumps(log_record, default=str, ensure_ascii=False)


def setup_logging(level: str = "INFO") -> None:
    """
    Configure application-wide structured JSON logging.
    Call once at startup from main.py / lifespan handler.
    """
    log_level = getattr(logging, level.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers to avoid duplicates on hot-reload
    for h in root_logger.handlers[:]:
        root_logger.removeHandler(h)

    root_logger.addHandler(handler)

    # --- Tune noisy third-party loggers ---
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.ERROR)
    logging.getLogger("motor").setLevel(logging.WARNING)
    logging.getLogger("pymongo").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("asyncio").setLevel(logging.WARNING)

    # Log startup confirmation
    startup_logger = logging.getLogger("kisano.logging")
    startup_logger.info(
        "Structured JSON logging initialized",
        extra={
            "log_level": level,
            "json_logging": True,
            "loki_ready": True,
            "elk_ready": True,
        },
    )


def get_logger(name: str) -> logging.Logger:
    """Helper to get a named logger — use throughout the codebase."""
    return logging.getLogger(name)
