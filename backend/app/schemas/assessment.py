from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class AssessmentCreate(BaseModel):
    patient_id: str
    input_data: Dict[str, float]
    prediction: Optional[int] = None
    prediction_label: Optional[str] = None
    confidence: Optional[float] = None
    risk_level: Optional[str] = None
    badge_color: Optional[str] = None
    probabilities: Optional[Dict[str, float]] = None
    feature_importances: Optional[List[Dict[str, Any]]] = None
    top_contributing_factors: Optional[List[Dict[str, Any]]] = None
    explanation: Optional[str] = ""
    notes: Optional[str] = ""

class AssessmentOut(BaseModel):
    id: str
    patient_id: str
    patient_name: Optional[str] = "Unknown"
    patient_age: Optional[int] = None
    patient_pregnancy_week: Optional[int] = None
    input_data: Dict[str, float]
    prediction: int
    prediction_label: str
    confidence: float
    risk_level: str
    badge_color: str
    probabilities: Dict[str, float]
    feature_importances: List[Dict[str, Any]]
    top_contributing_factors: List[Dict[str, Any]]
    explanation: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: str

class ExplanationRequest(BaseModel):
    prompt_context: Optional[str] = ""
