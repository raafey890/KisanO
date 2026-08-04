from enum import Enum

class ProductStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"
    OUT_OF_STOCK = "OUT_OF_STOCK"
    ARCHIVED = "ARCHIVED"
    DELETED = "DELETED"

# Finite State Machine - Defines valid transitions FROM a state TO a state
VALID_PRODUCT_TRANSITIONS = {
    ProductStatus.DRAFT: [ProductStatus.PENDING_APPROVAL, ProductStatus.DELETED],
    ProductStatus.PENDING_APPROVAL: [ProductStatus.APPROVED, ProductStatus.REJECTED, ProductStatus.DRAFT],
    ProductStatus.APPROVED: [ProductStatus.OUT_OF_STOCK, ProductStatus.SUSPENDED, ProductStatus.ARCHIVED],
    ProductStatus.OUT_OF_STOCK: [ProductStatus.APPROVED, ProductStatus.SUSPENDED, ProductStatus.ARCHIVED],
    ProductStatus.REJECTED: [ProductStatus.DRAFT],
    ProductStatus.SUSPENDED: [ProductStatus.APPROVED, ProductStatus.OUT_OF_STOCK],
    ProductStatus.ARCHIVED: [ProductStatus.APPROVED, ProductStatus.DRAFT],
    ProductStatus.DELETED: [ProductStatus.DRAFT] # Restore
}

class ProductCategory(str, Enum):
    SEEDS = "Seeds"
    FERTILIZERS = "Fertilizers"
    PESTICIDES = "Pesticides"
    HERBICIDES = "Herbicides"
    FUNGICIDES = "Fungicides"
    PLANT_GROWTH_REGULATORS = "Plant Growth Regulators"
    FARM_TOOLS = "Farm Tools"
    SPARE_PARTS = "Spare Parts"
    ANIMAL_FEED = "Animal Feed"
    ORGANIC_PRODUCTS = "Organic Products"
    IRRIGATION_ACCESSORIES = "Irrigation Accessories"
    SAFETY_EQUIPMENT = "Safety Equipment"
    OTHER = "Other"
