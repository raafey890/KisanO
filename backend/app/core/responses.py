from typing import Any, Optional
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

def standard_response(
    success: bool,
    message: str,
    data: Optional[Any] = None,
    errors: Optional[Any] = None,
    status_code: int = 200
) -> JSONResponse:
    content = {
        "success": success,
        "message": message,
    }
    if data is not None:
        content["data"] = data
    if errors is not None:
        content["errors"] = errors
        
    return JSONResponse(content=jsonable_encoder(content), status_code=status_code)
