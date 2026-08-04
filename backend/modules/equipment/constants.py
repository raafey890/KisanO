from enum import Enum

class EquipmentStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    AVAILABLE = "AVAILABLE"
    BOOKED = "BOOKED"
    MAINTENANCE = "MAINTENANCE"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"
    DELETED = "DELETED"

# Finite State Machine - Defines valid transitions FROM a state TO a state
VALID_TRANSITIONS = {
    EquipmentStatus.DRAFT: [EquipmentStatus.PENDING_APPROVAL, EquipmentStatus.DELETED],
    EquipmentStatus.PENDING_APPROVAL: [EquipmentStatus.APPROVED, EquipmentStatus.REJECTED, EquipmentStatus.DRAFT],
    EquipmentStatus.APPROVED: [EquipmentStatus.AVAILABLE, EquipmentStatus.SUSPENDED],
    EquipmentStatus.AVAILABLE: [EquipmentStatus.BOOKED, EquipmentStatus.MAINTENANCE, EquipmentStatus.SUSPENDED],
    EquipmentStatus.BOOKED: [EquipmentStatus.AVAILABLE, EquipmentStatus.MAINTENANCE],
    EquipmentStatus.MAINTENANCE: [EquipmentStatus.AVAILABLE, EquipmentStatus.SUSPENDED],
    EquipmentStatus.REJECTED: [EquipmentStatus.DRAFT],
    EquipmentStatus.SUSPENDED: [EquipmentStatus.AVAILABLE, EquipmentStatus.APPROVED],
    EquipmentStatus.DELETED: [EquipmentStatus.DRAFT] # Restore
}

class EquipmentCategory(str, Enum):
    TRACTOR = "Tractor"
    HARVESTER = "Harvester"
    ROTAVATOR = "Rotavator"
    CULTIVATOR = "Cultivator"
    SEED_DRILL = "Seed Drill"
    POWER_TILLER = "Power Tiller"
    SPRAYER = "Sprayer"
    BOOM_SPRAYER = "Boom Sprayer"
    DRONE_SPRAYER = "Drone Sprayer"
    THRESHER = "Thresher"
    EXCAVATOR = "Excavator"
    TRAILER = "Trailer"
    WATER_TANKER = "Water Tanker"
    LOADER = "Loader"
    OTHER = "Other"

class FuelType(str, Enum):
    DIESEL = "Diesel"
    PETROL = "Petrol"
    ELECTRIC = "Electric"
    MANUAL = "Manual"
    OTHER = "Other"
