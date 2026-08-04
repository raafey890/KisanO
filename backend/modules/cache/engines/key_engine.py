class KeyEngine:
    @staticmethod
    def user(user_id: str) -> str:
        return f"user:v1:{user_id}"

    @staticmethod
    def equipment(equipment_id: str) -> str:
        return f"equipment:v1:{equipment_id}"

    @staticmethod
    def feature_flags() -> str:
        return "feature_flags:v1"

    @staticmethod
    def settings() -> str:
        return "settings:global:v1"
        
    @staticmethod
    def analytics_dashboard() -> str:
        return "analytics:dashboard:v1"

key_engine = KeyEngine()
