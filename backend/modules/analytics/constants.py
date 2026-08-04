from enum import Enum

class MetricType(str, Enum):
    USER_GROWTH = "USER_GROWTH"
    REVENUE = "REVENUE"
    BOOKINGS = "BOOKINGS"
    MARKETPLACE_ORDERS = "MARKETPLACE_ORDERS"
    AI_USAGE = "AI_USAGE"
    SUPPORT_TICKETS = "SUPPORT_TICKETS"

class ReportType(str, Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    YEARLY = "YEARLY"
    CUSTOM = "CUSTOM"

class ChartType(str, Enum):
    LINE = "LINE"
    BAR = "BAR"
    PIE = "PIE"
    HEATMAP = "HEATMAP"
    GEOMAP = "GEOMAP"
    TREND = "TREND"

class ExportFormat(str, Enum):
    CSV = "CSV"
    JSON = "JSON"
    EXCEL = "EXCEL"
    PDF = "PDF"

class SnapshotInterval(str, Enum):
    HOURLY = "HOURLY"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    YEARLY = "YEARLY"
