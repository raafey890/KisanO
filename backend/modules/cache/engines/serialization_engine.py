import json
from typing import Any

class SerializationEngine:
    @staticmethod
    def serialize(value: Any) -> str:
        # In a real app, handle Pydantic objects or use msgpack
        return json.dumps(value)

    @staticmethod
    def deserialize(value_str: str) -> Any:
        try:
            return json.loads(value_str)
        except Exception:
            return value_str # Fallback for primitive strings

serialization_engine = SerializationEngine()
