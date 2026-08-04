from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from modules.ai_plant_doctor.constants import DiseaseSeverity, ConfidenceLevel, DiagnosisStatus, TreatmentType

# --- Immutable Snapshots ---

class FarmerSnapshot(BaseModel):
    farmerId: str
    farmerName: str
    farmerPhone: str

class FarmSnapshot(BaseModel):
    farmId: Optional[str] = None
    district: str
    village: str
    latitude: float
    longitude: float

class CropSnapshot(BaseModel):
    cropName: str
    cropStage: str
    affectedArea: Optional[float] = None
    symptoms: List[str] = []

class ConfidenceSummary(BaseModel):
    rawScore: float # e.g. 0.88
    level: ConfidenceLevel
    thresholdUsed: float # e.g. 0.80

class RecommendationTag(BaseModel):
    tagType: str # e.g. 'Fungicide', 'SprayerService'
    value: str

class TreatmentRecommendation(BaseModel):
    treatmentType: TreatmentType
    description: str
    products: List[str] = []
    searchTags: List[RecommendationTag] = []

# --- Main Diagnosis Models ---

class DiagnosisRequest(BaseModel):
    farmerId: str
    farmId: Optional[str] = None
    cropName: str
    cropStage: str
    symptoms: List[str] = []
    imageUrls: List[str]

class DiagnosisResponse(BaseModel):
    id: str
    diagnosisNumber: str
    
    farmerSnapshot: FarmerSnapshot
    farmSnapshot: FarmSnapshot
    cropSnapshot: CropSnapshot
    
    imageUrls: List[str]
    
    detectedDisease: str
    diseaseCategory: str
    diseaseDescription: str
    severity: DiseaseSeverity
    
    confidenceSummary: ConfidenceSummary
    treatments: List[TreatmentRecommendation]
    preventiveMeasures: List[str]
    
    aiProvider: str
    modelVersion: str
    promptVersion: str
    
    status: DiagnosisStatus
    isDeleted: bool
    createdAt: datetime
    updatedAt: datetime
    
# --- History & Audit Models ---

class AIFeedback(BaseModel):
    diagnosisId: str
    farmerId: str
    isCorrect: bool
    isHelpful: bool
    notes: Optional[str] = None
    createdAt: datetime
