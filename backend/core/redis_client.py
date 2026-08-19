import redis.asyncio as redis
from core.config import settings
import logging

logger = logging.getLogger(__name__)

class RedisManager:
    def __init__(self):
        self.redis = None

    async def connect(self):
        try:
            self.redis = redis.Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=2,
                socket_connect_timeout=2,
                retry_on_timeout=True,
                max_connections=50
            )
            await self.redis.ping()
            logger.info("Successfully connected to Redis.")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.redis = None

    async def disconnect(self):
        if self.redis:
            await self.redis.close()
            logger.info("Redis connection closed.")

redis_manager = RedisManager()

def get_redis():
    return redis_manager.redis
