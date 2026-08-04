import contextvars
from typing import Optional

# ContextVars allow storing contextual state per async request
request_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("request_id", default=None)
correlation_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("correlation_id", default=None)
user_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("user_id", default=None)

def get_request_id() -> Optional[str]:
    return request_id_ctx.get()

def set_request_id(req_id: str):
    request_id_ctx.set(req_id)

def get_correlation_id() -> Optional[str]:
    return correlation_id_ctx.get()

def set_correlation_id(corr_id: str):
    correlation_id_ctx.set(corr_id)

def get_user_id() -> Optional[str]:
    return user_id_ctx.get()

def set_user_id(u_id: str):
    user_id_ctx.set(u_id)
