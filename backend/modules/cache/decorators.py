import functools
import json
from fastapi import Request
from modules.cache.cache_manager import cache_manager
from fastapi.encoders import jsonable_encoder

def cache(expire: int = 300):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request")
            if not request:
                return await func(*args, **kwargs)

            key = f"cache:{request.url.path}?{request.url.query}"
            
            cached_data = await cache_manager.get(key)
            if cached_data:
                return json.loads(cached_data)

            response_data = await func(*args, **kwargs)
            
            if response_data:
                try:
                    enc_data = jsonable_encoder(response_data)
                    await cache_manager.set(key, json.dumps(enc_data), ttl_seconds=expire)
                except Exception:
                    pass

            return response_data
        return wrapper
    return decorator
