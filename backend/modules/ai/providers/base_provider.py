from abc import ABC, abstractmethod
from typing import Dict, Any, List

class IAIProvider(ABC):
    
    @abstractmethod
    async def analyze_image(self, system_prompt: str, image_url: str, user_prompt: str) -> str:
        """Sends an image and prompt to the Vision model."""
        pass
        
    @abstractmethod
    async def get_structured_response(self, system_prompt: str, user_prompt: str) -> str:
        """Asks a question expecting a structured JSON response."""
        pass

    @abstractmethod
    async def chat(self, system_prompt: str, messages: List[Dict[str, str]]) -> str:
        """Standard conversational chat."""
        pass
