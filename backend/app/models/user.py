from typing import Optional
from pydantic import BaseModel, Field

class UserModel(BaseModel):
    id: str
    name: str
    email: str
    password_hash: str
    role: str = "Obstetric Clinician"
    created_at: str

    class Config:
        extra = "allow"
