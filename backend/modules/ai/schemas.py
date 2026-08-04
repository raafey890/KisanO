from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class DiseaseReport(BaseModel):
    diseaseName: str
    scientificName: Optional[str] = None
    confidenceScore: float = Field(..., ge=0.0, le=100.0)
    severityLevel: str
    symptoms: List[str] = []
    causes: List[str] = []
    treatmentSteps: List[str] = []
    recommendedFertilizers: List[str] = []
    recommendedPesticides: List[str] = []
    recommendedEquipment: List[str] = []
    estimatedRecoveryTime: Optional[str] = None

class AdvisoryReport(BaseModel):
    summary: str
    fertilizerAdvice: List[str] = []
    irrigationAdvice: List[str] = []
    preventiveMeasures: List[str] = []
    followUpAdvice: Optional[str] = None

class ConsultationRequest(BaseModel):
    consultationType: str
    cropName: Optional[str] = None
    cropVariety: Optional[str] = None
    cropAgeDays: Optional[int] = None
    farmSizeAcres: Optional[float] = None
    location: Optional[str] = None
    question: Optional[str] = None
    images: List[str] = [] # URLs of uploaded images
    
class ConsultationResponse(BaseModel):
    id: str
    farmerId: str
    
    consultationType: str
    cropName: Optional[str] = None
    cropVariety: Optional[str] = None
    cropAgeDays: Optional[int] = None
    location: Optional[str] = None
    images: List[str] = []
    question: Optional[str] = None
    
    aiProvider: str
    aiModel: str
    
    diseaseReport: Optional[DiseaseReport] = None
    advisoryReport: Optional[AdvisoryReport] = None
    generalAnswer: Optional[str] = None
    
    status: str
    isFavourite: bool = False
    
    createdAt: datetime
    updatedAt: datetime
    
class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str
    
class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[Dict[str, Any]] = None

class AIAnalytics(BaseModel):
    totalConsultations: int = 0
    diseaseDetections: int = 0
    advisoryRequests: int = 0
    generalQaRequests: int = 0
    failedRequests: int = 0
    providerUsage: Dict[str, int] = {}
