from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import PredictionResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/predictions", tags=["ML Prediction"])

@router.post("", response_model=PredictionResponse)
async def predict_fetal_health(input_payload: Dict[str, Any]):
    """
    Run machine learning classification on 21 CTG parameters.
    Returns:
    - classification code (1: Normal, 2: Suspect, 3: Pathological)
    - classification label and risk severity
    - prediction confidence score and full probability distribution
    - feature importances and top contributing physiological factors
    """
    try:
        result = ml_service.predict(input_payload)
        return PredictionResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction failed: {str(e)}")

@router.get("/metadata")
async def get_model_metadata():
    """Retrieve CTG feature schemas, physiological descriptions, normal ranges, and presets."""
    return ml_service.get_feature_metadata()
