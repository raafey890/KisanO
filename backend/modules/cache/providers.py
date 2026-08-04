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


class RedisCacheProvider(BaseCacheProvider):
    def __init__(self):
        self._connected = False
        # In a real app: self.redis = redis.asyncio.Redis.from_url(...)

    async def get(self, key: str) -> Optional[Any]:
        # Mock Redis Miss
        return None

    async def set(self, key: str, value: Any, ttl_seconds: int = None):
        pass

    async def delete(self, key: str):
        pass

    async def clear_pattern(self, pattern: str):
        pass

    async def ping(self) -> bool:
        # Mock failure for MVP testing of fallback logic
        return False
