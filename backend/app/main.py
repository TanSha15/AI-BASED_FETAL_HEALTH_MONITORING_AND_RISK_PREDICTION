import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.services.ml_service import ml_service
from app.routes import auth, patients, assessments, predictions, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure ML model is loaded and initialized
    if ml_service.is_ready():
        print(f"[OK] ML Model successfully loaded: {settings.MODEL_PATH}")
    else:
        print(f"! Notice: ML Model failed to load from {settings.MODEL_PATH}")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI-Based Fetal Health Monitoring and Risk Prediction System combining CTG Machine Learning, Explainable AI, and Generative AI clinical narratives.",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(patients.router, prefix=settings.API_V1_PREFIX)
app.include_router(assessments.router, prefix=settings.API_V1_PREFIX)
app.include_router(predictions.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "model_loaded": ml_service.is_ready()
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "model_ready": ml_service.is_ready(),
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
