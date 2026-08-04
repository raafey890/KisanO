from fastapi import Request
from core.exceptions import AppException
from modules.cache.cache_engine import cache_engine
import time

class RateLimiter:
    """
    Token Bucket algorithm backed by CacheEngine.
    """
    @staticmethod
    async def check_rate_limit(key: str, max_requests: int = 100, window_seconds: int = 60):
        # We simulate a sliding window by tracking count per minute bucket
        current_minute = int(time.time() / window_seconds)
        cache_key = f"rl:{key}:{current_minute}"
        
        # We rely on existing cache provider which could be L1 or Redis L2
        current_count = await cache_engine.get(cache_key)
        if current_count is None:
            await cache_engine.set(cache_key, 1, ttl=window_seconds)
        elif int(current_count) >= max_requests:
            raise AppException(status_code=429, detail="Rate limit exceeded")
        else:
            await cache_engine.set(cache_key, int(current_count) + 1, ttl=window_seconds)

rate_limiter = RateLimiter()
