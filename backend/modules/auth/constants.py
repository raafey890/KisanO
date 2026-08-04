from enum import Enum

class UserRole(str, Enum):
    FARMER = "Farmer"
    EQUIPMENT_OWNER = "EquipmentOwner"
    SPRAYER_OPERATOR = "SprayerOperator"
    SELLER = "Seller"
    SUPPORT_AGENT = "SupportAgent"
    ADMIN = "Admin"
    SUPER_ADMIN = "SuperAdmin"
    READ_ONLY_ADMIN = "ReadOnlyAdmin"

class Permission(str, Enum):
    # Core User Permissions
    READ_PROFILE = "read:profile"
    UPDATE_PROFILE = "update:profile"
    
    # Equipment
    CREATE_EQUIPMENT = "create:equipment"
    UPDATE_EQUIPMENT = "update:equipment"
    DELETE_EQUIPMENT = "delete:equipment"
    
    # Orders / Bookings
    CREATE_ORDER = "create:order"
    MANAGE_BOOKINGS = "manage:bookings"
    
    # Admin
    MANAGE_USERS = "manage:users"
    VIEW_ANALYTICS = "view:analytics"
    MANAGE_SYSTEM = "manage:system"
