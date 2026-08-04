from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAIProvider(ABC):
    @abstractmethod
    async def analyze_image(self, image_url: str, crop_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes an image and returns a standard dictionary containing:
        - detectedDisease (str)
        - diseaseCategory (str)
        - diseaseDescription (str)
        - severity (str)
        - confidence (float)
        - treatments (List[Dict])
        - preventiveMeasures (List[str])
        """
        pass

    @property
    @abstractmethod
    def model_version(self) -> str:
        pass
        
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass


class MockAIProvider(BaseAIProvider):
    async def analyze_image(self, image_url: str, crop_context: Dict[str, Any]) -> Dict[str, Any]:
        # Return a deterministic mock for testing
        return {
            "detectedDisease": "Early Blight",
            "diseaseCategory": "Fungal",
            "diseaseDescription": "A common fungal disease affecting tomato leaves and stems.",
            "severity": "MEDIUM",
            "confidence": 0.88,
            "treatments": [
                {
                    "treatmentType": "CHEMICAL",
                    "description": "Apply a copper-based fungicide.",
                    "products": ["Copper Oxychloride 50% WP"],
                    "searchTags": [{"tagType": "Fungicide", "value": "Copper Oxychloride"}]
                },
                {
                    "treatmentType": "ORGANIC",
                    "description": "Spray neem oil extract to inhibit fungal growth.",
                    "products": ["Neem Oil 10000 PPM"],
                    "searchTags": [{"tagType": "Organic Fungi", "value": "Neem Oil"}]
                }
            ],
            "preventiveMeasures": [
                "Ensure proper plant spacing for air circulation.",
                "Avoid overhead watering."
            ]
        }

    @property
    def model_version(self) -> str:
        return "mock-vision-v1"

    @property
    def provider_name(self) -> str:
        return "MockAI"


class OpenAIProvider(BaseAIProvider):
    # In a real environment, you would use openai.AsyncOpenAI()
    # We provide the structure to show how it plugs in.
    
    async def analyze_image(self, image_url: str, crop_context: Dict[str, Any]) -> Dict[str, Any]:
        # prompt = f"Analyze this image of a {crop_context.get('cropName')} plant..."
        # response = await openai_client.chat.completions.create(...)
        # return parse_json(response)
        raise NotImplementedError("OpenAI integration requires valid API keys.")
        
    @property
    def model_version(self) -> str:
        return "gpt-4o-2024-05-13"

    @property
    def provider_name(self) -> str:
        return "OpenAI"

# Dependency Injection logic
def get_ai_provider(provider_type: str = "mock") -> BaseAIProvider:
    if provider_type == "openai":
        return OpenAIProvider()
    return MockAIProvider()
