import logging
from typing import Any, Optional
from modules.cache.cache_manager import cache_manager
from modules.cache.engines.key_engine import key_engine
from modules.cache.engines.serialization_engine import serialization_engine
from modules.cache.engines.ttl_engine import ttl_engine
from modules.cache.engines.metrics_engine import metrics_engine
from modules.cache.engines.invalidation_engine import invalidation_engine
from modules.cache.schemas import CacheStats, CacheHealthResponse
from modules.cache.constants import CacheStatus
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class CacheEngine:
    """
    Unified Orchestrator for the Cache Module.
    Business modules interact strictly with this interface.
    """
    
    @staticmethod
    async def get(key: str) -> Optional[Any]:
        val_str = await cache_manager.get(key)
        if val_str:
            metrics_engine.record_hit()
            return serialization_engine.deserialize(val_str)
        metrics_engine.record_miss()
        return None

    @staticmethod
    async def set(key: str, value: Any, ttl_seconds: int = None):
        if ttl_seconds is None:
            ttl_seconds = ttl_engine.get_default_ttl(key)
            
        val_str = serialization_engine.serialize(value)
        await cache_manager.set(key, val_str, ttl_seconds)

    @staticmethod
    async def delete(key: str):
        await cache_manager.delete(key)
        
    @staticmethod
    async def clear_pattern(pattern: str):
        await cache_manager.clear_pattern(pattern)

    @staticmethod
    async def invalidate_domain_entity(domain_type: str, item_id: str = None):
        """
        Called by event listeners. e.g. invalidate_domain_entity("equipment", "123")
        """
        pattern = invalidation_engine.build_pattern(domain_type, item_id)
        await cache_manager.clear_pattern(pattern)

    @staticmethod
    def get_stats() -> CacheStats:
        # Pass L1 size (number of keys in the dict)
        l1_size = len(cache_manager.l1_cache._store)
        return metrics_engine.get_stats(l1_size, cache_manager.l2_status)

    @staticmethod
    def get_health() -> CacheHealthResponse:
        status = cache_manager.l2_status
        return CacheHealthResponse(
            status=status,
            timestamp=datetime.now(timezone.utc),
            l1Status="UP",
            l2Status=status.value,
            lastL2Error=cache_manager.last_error
        )

# Expose KeyEngine for external modules to build keys safely
cache_engine = CacheEngine()
