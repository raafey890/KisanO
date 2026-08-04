from enum import Enum

class ApiVersion(str, Enum):
    V1 = "v1"
    V2 = "v2"

class DiscoveryProvider(str, Enum):
    STATIC = "static"
    CONSUL = "consul"
    KUBERNETES = "kubernetes"
