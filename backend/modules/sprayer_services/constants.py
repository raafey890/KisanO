from enum import Enum

class ServiceStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    AVAILABLE = "AVAILABLE"
    BUSY = "BUSY"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"
    ARCHIVED = "ARCHIVED"
    DELETED = "DELETED"

# Finite State Machine
VALID_SERVICE_TRANSITIONS = {
    ServiceStatus.DRAFT: [ServiceStatus.PENDING_APPROVAL, ServiceStatus.DELETED],
    ServiceStatus.PENDING_APPROVAL: [ServiceStatus.APPROVED, ServiceStatus.REJECTED, ServiceStatus.DRAFT],
    ServiceStatus.APPROVED: [ServiceStatus.AVAILABLE, ServiceStatus.SUSPENDED, ServiceStatus.ARCHIVED],
    ServiceStatus.AVAILABLE: [ServiceStatus.BUSY, ServiceStatus.SUSPENDED, ServiceStatus.ARCHIVED],
    ServiceStatus.BUSY: [ServiceStatus.AVAILABLE], # Frees up when booking finishes
    ServiceStatus.REJECTED: [ServiceStatus.DRAFT],
    ServiceStatus.SUSPENDED: [ServiceStatus.APPROVED],
    ServiceStatus.ARCHIVED: [ServiceStatus.DRAFT, ServiceStatus.APPROVED],
    ServiceStatus.DELETED: [ServiceStatus.DRAFT]
}

class ServiceType(str, Enum):
    MANUAL_SPRAYING = "Manual Spraying"
    POWER_SPRAYER = "Power Sprayer"
    BOOM_SPRAYER = "Boom Sprayer"
    DRONE_SPRAYING = "Drone Spraying"
    TRACTOR_MOUNTED = "Tractor Mounted Sprayer"
    ULTRA_LOW_VOLUME = "Ultra Low Volume Spraying"
    CUSTOM = "Custom Services"
