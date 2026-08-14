from fastapi import APIRouter

from shared.responses import success_response

router = APIRouter()


@router.get("/health")
async def gateway_health():
    """API Gateway health check."""
    return success_response(message="Gateway operational", data={"status": "UP"})


@router.get("/info")
async def gateway_info():
    """API Gateway configuration info."""
    return success_response(
        message="Gateway info",
        data={"version": "1.0.0", "mode": "api-gateway"}
    )
