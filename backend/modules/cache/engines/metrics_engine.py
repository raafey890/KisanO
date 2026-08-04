import time
from modules.cache.schemas import CacheStats
from modules.cache.constants import CacheStatus

class MetricsEngine:
    def __init__(self):
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self.start_time = time.time()

    def record_hit(self):
        self.hits += 1

    def record_miss(self):
        self.misses += 1
        
    def record_eviction(self):
        self.evictions += 1

    def get_stats(self, l1_size: int, l2_status: CacheStatus) -> CacheStats:
        total = self.hits + self.misses
        ratio = (self.hits / total) if total > 0 else 0.0
        uptime = time.time() - self.start_time
        
        return CacheStats(
            hits=self.hits,
            misses=self.misses,
            hitRatio=round(ratio, 2),
            evictions=self.evictions,
            l1Items=l1_size,
            l2Status=l2_status,
            uptimeSeconds=round(uptime, 2)
        )

metrics_engine = MetricsEngine()
