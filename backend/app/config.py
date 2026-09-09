import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Based Fetal Health Monitoring and Risk Prediction System"
    API_V1_PREFIX: str = "/api"
    VERSION: str = "1.0.0"
    
    # MongoDB Settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "fetal_health_db"
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "fetal_health_super_secret_jwt_key_2026_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # ML Model Path
    MODEL_PATH: str = str(PROJECT_ROOT / "ml" / "models" / "fetal_health_model.pkl")
    
    # Reports directory
    REPORTS_DIR: str = str(PROJECT_ROOT / "reports")
    
    # Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = str(BASE_DIR / ".env")
        extra = "allow"

settings = Settings()
