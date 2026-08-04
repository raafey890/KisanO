from fastapi import Response
from starlette.responses import JSONResponse
import json
from modules.gateway.schemas import RequestMetadata

class ResponseTransformer:
    @staticmethod
    def envelope_response(response: Response, meta: RequestMetadata) -> Response:
        """
        Wraps the raw business response in the GatewayResponseEnvelope.
        Injects standard headers.
        """
        # Inject standard gateway metadata headers
        response.headers["X-Correlation-ID"] = meta.correlation_id
        response.headers["X-API-Version"] = meta.version
        
        # Note: In a true middleware, transforming the body of an arbitrary streaming response
        # can be complex and performance-heavy. 
        # For the MVP, we assume business modules return clean JSON, and we just inject headers.
        # Enveloping logic would happen via custom APIRoute classes in FastAPI.
        
        return response

response_transformer = ResponseTransformer()
