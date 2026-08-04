from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel
from datetime import datetime, date
from modules.analytics.constants import SnapshotInterval, MetricType, ChartType, ExportFormat

# --- Dashboards & Visualization ---

class ChartMetadata(BaseModel):
    title: str
    chartType: ChartType
    labels: List[str]
    datasets: List[Dict[str, Any]]
    xAxisLabel: Optional[str] = None
    yAxisLabel: Optional[str] = None

class DashboardWidget(BaseModel):
    widgetId: str
    title: str
    metricType: MetricType
    value: Union[int, float, str]
    previousValue: Optional[Union[int, float, str]] = None
    percentageChange: Optional[float] = None
    chart: Optional[ChartMetadata] = None

class DashboardResponse(BaseModel):
    generatedAt: datetime
    widgets: List[DashboardWidget]

# --- Snapshots ---

class KPISnapshot(BaseModel):
    interval: SnapshotInterval
    timestamp: datetime # e.g. 2026-08-01T00:00:00 for a DAILY snapshot
    metricType: MetricType
    value: float
    dimensions: Dict[str, str] = {} # e.g. {"region": "North", "device": "mobile"}
    
class SnapshotUpdatePayload(BaseModel):
    metricType: MetricType
    valueIncrement: float
    dimensions: Dict[str, str] = {}

# --- Reports & Exports ---

class ExportRequest(BaseModel):
    reportName: str
    format: ExportFormat
    filters: Dict[str, Any] = {}

class ExportResponse(BaseModel):
    downloadUrl: str
    expiresAt: datetime
    format: ExportFormat

# --- Forecasting ---

class ForecastResult(BaseModel):
    metricType: MetricType
    modelUsed: str
    predictions: List[Dict[str, Any]] # e.g. [{"date": "2026-09-01", "predictedValue": 5000}]
    confidenceInterval: Optional[Dict[str, float]] = None
