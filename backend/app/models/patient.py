from typing import Optional
from pydantic import BaseModel, Field

class PatientModel(BaseModel):
    id: str
    name: str
    age: int
    pregnancy_week: int
    contact: Optional[str] = ""
    blood_group: Optional[str] = ""
    medical_history: Optional[str] = ""
    notes: Optional[str] = ""
    created_by: Optional[str] = None
    created_at: str

    class Config:
        extra = "allow"
