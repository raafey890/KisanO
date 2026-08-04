import os
from abc import ABC, abstractmethod
from typing import Optional

class BaseSecretProvider(ABC):
    @abstractmethod
    def get_secret(self, key: str) -> Optional[str]:
        pass

class EnvironmentSecretProvider(BaseSecretProvider):
    def get_secret(self, key: str) -> Optional[str]:
        return os.getenv(key)

class SecretManager:
    def __init__(self, provider: BaseSecretProvider):
        self.provider = provider
        
    def get(self, key: str) -> str:
        val = self.provider.get_secret(key)
        if val is None:
            raise ValueError(f"Secret {key} not found in configured SecretProvider")
        return val

# MVP Default
secret_manager = SecretManager(provider=EnvironmentSecretProvider())
