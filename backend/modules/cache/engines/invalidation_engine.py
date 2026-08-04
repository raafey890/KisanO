from typing import List

class InvalidationEngine:
    @staticmethod
    def build_pattern(domain_type: str, item_id: str = None) -> str:
        """
        Builds pattern to clear caches upon domain events.
        Example: EquipmentUpdated(123) -> clear "equipment:*:123"
        """
        if item_id:
            return f"{domain_type}:*:{item_id}"
        return f"{domain_type}:*"

invalidation_engine = InvalidationEngine()
