from enum import Enum

class CachePolicy(str, Enum):
    CACHE_ASIDE = "CACHE_ASIDE"
    READ_THROUGH = "READ_THROUGH"
    WRITE_THROUGH = "WRITE_THROUGH"
    REFRESH_AHEAD = "REFRESH_AHEAD"

class CacheLevel(str, Enum):
    L1 = "L1" # In-memory
    L2 = "L2" # Redis
    BOTH = "BOTH"

class CacheStatus(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED" # Redis down, running on L1 only
    DOWN = "DOWN"
