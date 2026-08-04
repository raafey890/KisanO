class TTLEngine:
    @staticmethod
    def get_default_ttl(key: str) -> int:
        if key.startswith("user:"): return 3600       # 1 hour
        if key.startswith("equipment:"): return 86400 # 24 hours
        if key.startswith("analytics:"): return 600   # 10 minutes
        if key.startswith("settings:"): return 86400  # 24 hours
        return 300 # Default 5 mins

ttl_engine = TTLEngine()
