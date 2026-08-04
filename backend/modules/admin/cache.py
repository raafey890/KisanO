import logging
from typing import Dict, Any
from modules.admin.repository import settings_repo, feature_flag_repo

logger = logging.getLogger(__name__)

class ConfigurationCache:
    """
    In-memory cache synchronized with MongoDB for sub-millisecond config lookups.
    """
    def __init__(self):
        self._settings_cache: Dict[str, Any] = {}
        self._flags_cache: Dict[str, Any] = {}

    async def initialize(self):
        # Load Settings
        settings = await settings_repo.get_all_settings()
        for s in settings:
            self._settings_cache[s["key"]] = s["value"]
            
        # Load Feature Flags
        flags = await feature_flag_repo.get_all_flags()
        for f in flags:
            self._flags_cache[f["flagKey"]] = f
            
        logger.info(f"ConfigurationCache initialized. Settings: {len(self._settings_cache)}, Flags: {len(self._flags_cache)}")

    def get_setting(self, key: str, default: Any = None) -> Any:
        return self._settings_cache.get(key, default)

    def get_flag(self, flag_key: str) -> Dict[str, Any]:
        return self._flags_cache.get(flag_key)

    def update_setting_cache(self, key: str, value: Any):
        self._settings_cache[key] = value

    def update_flag_cache(self, flag_key: str, data: Dict[str, Any]):
        self._flags_cache[flag_key] = data

config_cache = ConfigurationCache()
