from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class AssessmentModel(BaseModel):
    id: str
    patient_id: str
    patient_name: str
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
    explanation: str = ""
    notes: Optional[str] = ""
    created_by: Optional[str] = None
    created_at: str

    class Config:
        extra = "allow"
