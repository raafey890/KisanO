from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.marketplace.constants import ProductStatus, ProductCategory

# --- Embedded Documents ---

class SellerSnapshot(BaseModel):
    sellerId: str
    sellerName: str
    businessName: Optional[str] = None
    sellerRating: float = 0.0
    verificationStatus: str = "PENDING"
    district: Optional[str] = None
    state: Optional[str] = None

class ProductImage(BaseModel):
    imageId: str
    cloudinaryUrl: str
    thumbnailUrl: str
    displayOrder: int = 0
    isCover: bool = False
    uploadedAt: datetime

class PricingSchema(BaseModel):
    mrp: float = Field(..., gt=0)
    sellingPrice: float = Field(..., gt=0)
    discountPercentage: float = 0.0
    bulkPricingEnabled: bool = False
    bulkMinimumQuantity: Optional[int] = None
    bulkSellingPrice: Optional[float] = None
    wholesaleEnabled: bool = False
    wholesaleMinimumQuantity: Optional[int] = None
    wholesaleSellingPrice: Optional[float] = None

class InventorySchema(BaseModel):
    currentStock: int = 0
    reservedStock: int = 0 # Future integration for carts/orders
    lowStockThreshold: int = 10
    minimumOrderQuantity: int = 1
    maximumOrderQuantity: Optional[int] = None
    restockDate: Optional[datetime] = None

class AnalyticsSummary(BaseModel):
    views: int = 0
    searchCount: int = 0
    orderCount: int = 0
    revenue: float = 0.0
    averageRating: float = 0.0
    reviewCount: int = 0

# --- Root Product ---

class ProductCreate(BaseModel):
    productName: str = Field(..., min_length=3)
    category: ProductCategory
    subCategory: Optional[str] = None
    brand: str
    manufacturer: Optional[str] = None
    description: str = Field(..., min_length=10)
    specifications: Dict[str, str] = {}
    weight: float = Field(..., gt=0)
    unit: str = Field(..., description="kg, liter, packet, piece")
    packageSize: Optional[str] = None
    pricing: PricingSchema
    inventory: InventorySchema

class ProductUpdate(BaseModel):
    productName: Optional[str] = None
    subCategory: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[Dict[str, str]] = None
    weight: Optional[float] = None
    unit: Optional[str] = None
    packageSize: Optional[str] = None

class ProductResponse(BaseModel):
    id: str
    sku: str
    productName: str
    category: ProductCategory
    subCategory: Optional[str]
    brand: str
    manufacturer: Optional[str]
    description: str
    specifications: Dict[str, str]
    weight: float
    unit: str
    packageSize: Optional[str]
    
    status: ProductStatus
    sellerSnapshot: SellerSnapshot
    pricing: PricingSchema
    inventory: InventorySchema
    images: List[ProductImage]
    analytics: AnalyticsSummary
    
    version: int
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime
    
class PaginatedProductResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    skip: int
    limit: int

# --- Separated Collections ---

class InventoryUpdate(BaseModel):
    quantityAdded: int
    notes: Optional[str] = None

class PricingUpdate(BaseModel):
    pricing: PricingSchema
    reason: Optional[str] = None
