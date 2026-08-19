from fastapi import Request, HTTPException, status
import time
from core.redis_client import get_redis

class RateLimiter:
    def __init__(self, times: int, seconds: int):
        self.times = times
        self.seconds = seconds

    async def __call__(self, request: Request):
        redis_client = get_redis()
        # If redis is down, fallback to allow (graceful degradation)
        if not redis_client:
            return True
            
        forwarded = request.headers.get("x-forwarded-for")
        ip = forwarded.split(",")[0].strip() if forwarded else request.client.host
        
        path = request.url.path
        key = f"ratelimit:{path}:{ip}"
        
        try:
            current = await redis_client.get(key)
            if current and int(current) >= self.times:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests, please try again later."
                )
                
            pipe = redis_client.pipeline()
            pipe.incr(key)
            pipe.expire(key, self.seconds)
            await pipe.execute()
        except HTTPException:
            raise
        except Exception:
            # Fallback to allow if Redis has a transient error
            pass
            
        return True
