from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import time

class BaseCacheEngine(ABC):
    @abstractmethod
    def get(self, key: str) -> Optional[Any]:
        pass

    @abstractmethod
    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        pass

class InMemoryCache(BaseCacheEngine):
    """
    Mock InMemoryCache. 
    In production, this would be replaced with Redis.
    """
    def __init__(self):
        self._store = {}
        
    def get(self, key: str) -> Optional[Any]:
        item = self._store.get(key)
        if not item:
            return None
        if time.time() > item["expires_at"]:
            del self._store[key]
            return None
        return item["value"]

    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        self._store[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds
        }

cache_engine = InMemoryCache()
