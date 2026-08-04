from fastapi import APIRouter, Depends, status, UploadFile, File, Query
from typing import Dict, Any, List, Optional
from shared.responses import success_response, SuccessResponse
from modules.marketplace.schemas import (
    ProductCreate, ProductUpdate, ProductResponse, PaginatedProductResponse,
    PricingUpdate, InventoryUpdate
)
from modules.marketplace.service import MarketplaceService
from modules.marketplace.constants import ProductStatus, ProductCategory
from modules.auth.dependencies import get_current_user, RequireRole
from modules.auth.constants import UserRole

router = APIRouter()

@router.post(
    "/products",
    response_model=SuccessResponse[Dict[str, str]],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new marketplace product"
)
async def create_product(
    data: ProductCreate,
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Register a new product in the marketplace catalog. 
    Generates a unique SKU automatically and captures an immutable snapshot of the seller's profile.
    Initial status is set to DRAFT.
    """
    product_id = await MarketplaceService.create_product(str(current_user["_id"]), data)
    return success_response(message="Product created successfully in DRAFT mode", data={"id": product_id})


@router.get(
    "/products/{product_id}",
    response_model=SuccessResponse[ProductResponse],
    summary="Get product details"
)
async def get_product(product_id: str):
    """
    Fetch the complete embedded product document.
    """
    product = await MarketplaceService.get_product(product_id)
    return success_response(message="Product retrieved", data=product)


@router.put(
    "/products/{product_id}",
    response_model=SuccessResponse[ProductResponse],
    summary="Update product details"
)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    current_version: int = Query(..., description="Current version for optimistic locking"),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Updates the base product document. MUST provide the `current_version` to prevent Lost Updates.
    """
    product = await MarketplaceService.update_product(product_id, str(current_user["_id"]), current_version, data)
    return success_response(message="Product updated successfully", data=product)


@router.patch(
    "/products/{product_id}/status",
    response_model=SuccessResponse[None],
    summary="Change product status (FSM)"
)
async def change_status(
    product_id: str,
    new_status: ProductStatus,
    current_version: int = Query(...),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Transitions the product through the Finite State Machine (e.g., DRAFT -> PENDING_APPROVAL).
    Admins can force transitions.
    """
    await MarketplaceService.change_status(product_id, str(current_user["_id"]), current_user["role"], new_status, current_version)
    return success_response(message=f"Status changed to {new_status.value}")


@router.patch(
    "/products/{product_id}/pricing",
    response_model=SuccessResponse[None],
    summary="Update product pricing"
)
async def update_pricing(
    product_id: str,
    data: PricingUpdate,
    current_version: int = Query(...),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Updates the pricing block and logs the change to the separated `price_history` collection.
    """
    await MarketplaceService.update_pricing(product_id, str(current_user["_id"]), current_version, data)
    return success_response(message="Pricing updated successfully")


@router.patch(
    "/products/{product_id}/inventory",
    response_model=SuccessResponse[None],
    summary="Update product inventory"
)
async def update_inventory(
    product_id: str,
    data: InventoryUpdate,
    current_version: int = Query(...),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
):
    """
    Atomically adds/removes quantity from currentStock and logs to `inventory_history`.
    """
    await MarketplaceService.update_inventory(product_id, str(current_user["_id"]), current_version, data)
    return success_response(message="Inventory updated successfully")


@router.post(
    "/products/{product_id}/upload-images",
    response_model=SuccessResponse[Dict[str, str]],
    summary="Upload product image"
)
async def upload_image(
    product_id: str,
    file: UploadFile = File(...),
    is_cover: bool = Query(False),
    current_user: Dict[str, Any] = Depends(RequireRole([UserRole.SELLER]))
):
    """
    Uploads an image via MediaService and pushes it into the embedded images array.
    """
    contents = await file.read()
    url = await MarketplaceService.upload_image(product_id, str(current_user["_id"]), contents, file.filename, is_cover)
    return success_response(message="Image uploaded successfully", data={"url": url})


@router.get(
    "/query/search",
    response_model=SuccessResponse[PaginatedProductResponse],
    summary="Search marketplace products"
)
async def search_products(
    text: Optional[str] = Query(None),
    category: Optional[ProductCategory] = Query(None),
    brand: Optional[str] = Query(None),
    seller_id: Optional[str] = Query(None),
    status: Optional[ProductStatus] = Query(ProductStatus.APPROVED),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    sort: Optional[str] = Query("newest", description="newest, price_low, price_high, rating"),
    skip: int = 0,
    limit: int = 20
):
    """
    Search catalog globally. Uses MongoDB Text Indexes on productName, brand, and category.
    """
    filters = {}
    if text: filters["text"] = text
    if category: filters["category"] = category.value
    if brand: filters["brand"] = brand
    if status: filters["status"] = status.value
    if seller_id: filters["sellerId"] = seller_id
    if min_price is not None: filters["minPrice"] = min_price
    if max_price is not None: filters["maxPrice"] = max_price
    if sort: filters["sort"] = sort

    items, total = await MarketplaceService.search(filters, skip, limit)
    return success_response(message="Products found", data={"items": items, "total": total, "skip": skip, "limit": limit})
