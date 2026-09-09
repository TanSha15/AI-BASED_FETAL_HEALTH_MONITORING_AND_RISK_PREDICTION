from typing import Optional
from pydantic import BaseModel, Field

class PatientCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=12, le=60)
    pregnancy_week: int = Field(..., ge=16, le=44)
    contact: Optional[str] = ""
    blood_group: Optional[str] = ""
    medical_history: Optional[str] = ""
    notes: Optional[str] = ""

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    pregnancy_week: Optional[int] = None
    contact: Optional[str] = None
    blood_group: Optional[str] = None
    medical_history: Optional[str] = None
    notes: Optional[str] = None

class PatientOut(BaseModel):
    id: str
    name: str
    age: int
    pregnancy_week: int
    contact: Optional[str] = ""
    blood_group: Optional[str] = ""
    medical_history: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: Optional[str] = None
    total_assessments: Optional[int] = 0
    latest_assessment: Optional[dict] = None
