import logging
from typing import Any, Optional
from modules.cache.providers import InMemoryCacheProvider, RedisCacheProvider
from modules.cache.constants import CacheStatus

logger = logging.getLogger(__name__)

class CacheManager:
    """
    Manages multi-level caching (L1/L2) with automatic fallback.
    """
    def __init__(self):
        self.l1_cache = InMemoryCacheProvider()
        self.l2_cache = RedisCacheProvider()
        self.l2_status = CacheStatus.HEALTHY
        self.last_error = None

    async def get(self, key: str) -> Optional[Any]:
        # 1. Try L1 (Memory)
        val = await self.l1_cache.get(key)
        if val is not None:
            return val
            
        # 2. Try L2 (Redis) if healthy
        if self.l2_status == CacheStatus.HEALTHY:
            try:
                val = await self.l2_cache.get(key)
                if val is not None:
                    # Backfill L1
                    await self.l1_cache.set(key, val, ttl_seconds=300) # Short L1 TTL
                return val
            except Exception as e:
                logger.warning(f"L2 Cache failed during GET: {str(e)}. Degrading to L1 only.")
                self.l2_status = CacheStatus.DEGRADED
                self.last_error = str(e)
                
        return None

    async def set(self, key: str, value: Any, ttl_seconds: int = None):
        # Write to L1
        await self.l1_cache.set(key, value, ttl_seconds)
        
        # Write to L2
        if self.l2_status == CacheStatus.HEALTHY:
            try:
                await self.l2_cache.set(key, value, ttl_seconds)
            except Exception as e:
                logger.warning(f"L2 Cache failed during SET: {str(e)}. Degrading to L1 only.")
                self.l2_status = CacheStatus.DEGRADED
                self.last_error = str(e)

    async def delete(self, key: str):
        await self.l1_cache.delete(key)
        if self.l2_status == CacheStatus.HEALTHY:
            try:
                await self.l2_cache.delete(key)
            except Exception:
                pass

    async def clear_pattern(self, pattern: str):
        await self.l1_cache.clear_pattern(pattern)
        if self.l2_status == CacheStatus.HEALTHY:
            try:
                await self.l2_cache.clear_pattern(pattern)
            except Exception:
                pass

    async def check_l2_health(self):
        """Called by a background worker to attempt reconnection."""
        if self.l2_status == CacheStatus.DEGRADED:
            is_up = await self.l2_cache.ping()
            if is_up:
                logger.info("L2 Cache recovered. Promoting to HEALTHY.")
                self.l2_status = CacheStatus.HEALTHY
                self.last_error = None

cache_manager = CacheManager()
