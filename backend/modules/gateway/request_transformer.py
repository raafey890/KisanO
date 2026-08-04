import uuid
from fastapi import Request
from modules.gateway.schemas import RequestMetadata
from modules.gateway.versioning import versioning_engine

class RequestTransformer:
    @staticmethod
    def extract_metadata(request: Request) -> RequestMetadata:
        """
        Normalizes headers and extracts unified Gateway Metadata.
        """
        # Fast API / Starlette Request State allows passing objects downstream
        correlation_id = request.headers.get("x-correlation-id") or str(uuid.uuid4())
        tenant_id = request.headers.get("x-tenant-id")
        client_ip = request.client.host if request.client else "unknown"
        version = versioning_engine.extract_version(request)

        meta = RequestMetadata(
            version=version,
            tenant_id=tenant_id,
            correlation_id=correlation_id,
            client_ip=client_ip
        )
        
        # Inject into state for business modules
        request.state.gateway_meta = meta
        return meta

request_transformer = RequestTransformer()
