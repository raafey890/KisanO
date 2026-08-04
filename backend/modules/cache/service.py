from typing import Dict, Any, List
from modules.cache.cache_engine import cache_engine
from modules.cache.engines.warming_engine import warming_engine
from modules.cache.schemas import CacheStats, CacheHealthResponse

class CacheService:
    @staticmethod
    def get_health() -> CacheHealthResponse:
        return cache_engine.get_health()
        
    @staticmethod
    def get_stats() -> CacheStats:
        return cache_engine.get_stats()

    @staticmethod
    async def invalidate(pattern: str):
        await cache_engine.clear_pattern(pattern)

    @staticmethod
    async def warmup():
        await warming_engine.warmup_dashboard()
