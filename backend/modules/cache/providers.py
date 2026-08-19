import time
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List

class BaseCacheProvider(ABC):
    @abstractmethod
    async def get(self, key: str) -> Optional[Any]:
        pass

    @abstractmethod
    async def set(self, key: str, value: Any, ttl_seconds: int = None):
        pass

    @abstractmethod
    async def delete(self, key: str):
        pass

    @abstractmethod
    async def clear_pattern(self, pattern: str):
        pass

    @abstractmethod
    async def ping(self) -> bool:
        pass


class InMemoryCacheProvider(BaseCacheProvider):
    def __init__(self):
        self._store = {}

    async def get(self, key: str) -> Optional[Any]:
        item = self._store.get(key)
        if not item: return None
        if item["expires_at"] and time.time() > item["expires_at"]:
            del self._store[key]
            return None
        return item["value"]

    async def set(self, key: str, value: Any, ttl_seconds: int = None):
        expires_at = time.time() + ttl_seconds if ttl_seconds else None
        self._store[key] = {"value": value, "expires_at": expires_at}

    async def delete(self, key: str):
        self._store.pop(key, None)

    async def clear_pattern(self, pattern: str):
        # Convert redis pattern (e.g. user:*) to simple matching
        prefix = pattern.replace("*", "")
        keys_to_delete = [k for k in self._store.keys() if k.startswith(prefix)]
        for k in keys_to_delete:
            del self._store[k]

    async def ping(self) -> bool:
        return True


from core.redis_client import get_redis

class RedisCacheProvider(BaseCacheProvider):
    def __init__(self):
        # The connection pool is managed globally in core.redis_client
        pass

    @property
    def redis(self):
        return get_redis()

    async def get(self, key: str) -> Optional[Any]:
        if not self.redis: return None
        return await self.redis.get(key)

    async def set(self, key: str, value: Any, ttl_seconds: int = None):
        if not self.redis: return
        if ttl_seconds:
            await self.redis.setex(key, ttl_seconds, value)
        else:
            await self.redis.set(key, value)

    async def delete(self, key: str):
        if not self.redis: return
        await self.redis.delete(key)

    async def clear_pattern(self, pattern: str):
        if not self.redis: return
        # Handle async cursor scanning
        cursor = '0'
        while cursor != 0:
            cursor, keys = await self.redis.scan(cursor=cursor, match=pattern, count=100)
            if keys:
                await self.redis.delete(*keys)

    async def ping(self) -> bool:
        if not self.redis: return False
        try:
            return await self.redis.ping()
        except:
            return False
