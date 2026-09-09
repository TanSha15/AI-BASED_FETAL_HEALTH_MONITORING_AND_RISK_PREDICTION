import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.assessment import AssessmentCreate, AssessmentOut, ExplanationRequest
from app.services.database import get_assessments_collection, get_patients_collection
from app.services.ml_service import ml_service
from app.services.gemini_service import gemini_service
from app.utils.security import get_current_user

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.post("", response_model=AssessmentOut, status_code=status.HTTP_201_CREATED)
async def create_assessment(assessment_in: AssessmentCreate, current_user: dict = Depends(get_current_user)):
    patients_coll = get_patients_collection()
    assessments_coll = get_assessments_collection()
    
    # Verify patient exists
    patient = patients_coll.find_one({"id": assessment_in.patient_id}) or patients_coll.find_one({"_id": assessment_in.patient_id})
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Referenced patient does not exist.")
        
    patient_name = patient.get("name", "Unknown Patient")
    patient_age = patient.get("age")
    patient_week = patient.get("pregnancy_week")
    
    # If ML prediction was not pre-calculated, run ML pipeline here
    if assessment_in.prediction is None or assessment_in.confidence is None:
        try:
            pred_result = ml_service.predict(assessment_in.input_data)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"ML Evaluation failed: {e}")
            
        prediction = pred_result["prediction"]
        prediction_label = pred_result["prediction_label"]
        confidence = pred_result["confidence"]
        risk_level = pred_result["risk_level"]
        badge_color = pred_result["badge_color"]
        probabilities = pred_result["probabilities"]
        feature_importances = pred_result["feature_importances"]
        top_contributing_factors = pred_result["top_contributing_factors"]
    else:
        prediction = assessment_in.prediction
        prediction_label = assessment_in.prediction_label or "Normal"
        confidence = assessment_in.confidence
        risk_level = assessment_in.risk_level or "Low Risk"
        badge_color = assessment_in.badge_color or "green"
        probabilities = assessment_in.probabilities or {}
        feature_importances = assessment_in.feature_importances or []
        top_contributing_factors = assessment_in.top_contributing_factors or []

    # Generate explanation if not supplied
    explanation = assessment_in.explanation
    if not explanation:
        explanation = gemini_service.generate_explanation(
            prediction_label=prediction_label,
            confidence=confidence,
            top_factors=top_contributing_factors,
            input_data=assessment_in.input_data,
            patient_info={"name": patient_name, "age": patient_age, "pregnancy_week": patient_week}
        )

    assessment_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "_id": assessment_id,
        "id": assessment_id,
        "patient_id": assessment_in.patient_id,
        "patient_name": patient_name,
        "patient_age": patient_age,
        "patient_pregnancy_week": patient_week,
        "input_data": assessment_in.input_data,
        "prediction": prediction,
        "prediction_label": prediction_label,
        "confidence": confidence,
        "risk_level": risk_level,
        "badge_color": badge_color,
        "probabilities": probabilities,
        "feature_importances": feature_importances,
        "top_contributing_factors": top_contributing_factors,
        "explanation": explanation,
        "notes": assessment_in.notes or "",
        "created_by": current_user["id"],
        "created_at": now_iso
    }
    
    assessments_coll.insert_one(doc)
    
    return AssessmentOut(**doc)

@router.get("/stats/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    """Summary metrics and charts data for dashboard."""
    assessments_coll = get_assessments_collection()
    patients_coll = get_patients_collection()
    
    total_assessments = assessments_coll.count_documents({})
    total_patients = patients_coll.count_documents({})
    
    all_assessments = list(assessments_coll.find().sort("created_at", -1))
    
    normal_count = sum(1 for a in all_assessments if a.get("prediction") == 1 or a.get("prediction_label") == "Normal")
    suspect_count = sum(1 for a in all_assessments if a.get("prediction") == 2 or a.get("prediction_label") == "Suspect")
    pathological_count = sum(1 for a in all_assessments if a.get("prediction") == 3 or a.get("prediction_label") == "Pathological")
    
    recent = all_assessments[:6]
    for r in recent:
        if "_id" in r:
            r["_id"] = str(r["_id"])
            
    distribution = [
        {"name": "Normal", "value": normal_count, "color": "#10B981"},
        {"name": "Suspect", "value": suspect_count, "color": "#F59E0B"},
        {"name": "Pathological", "value": pathological_count, "color": "#EF4444"}
    ]
    
    return {
        "total_assessments": total_assessments,
        "total_patients": total_patients,
        "normal_count": normal_count,
        "suspect_count": suspect_count,
        "pathological_count": pathological_count,
        "distribution": distribution,
        "recent_assessments": recent
    }

@router.get("", response_model=List[AssessmentOut])
async def list_assessments(current_user: dict = Depends(get_current_user)):
    assessments_coll = get_assessments_collection()
    docs = list(assessments_coll.find().sort("created_at", -1))
    results = []
    for d in docs:
        d["id"] = str(d.get("id") or d.get("_id"))
        results.append(AssessmentOut(**d))
    return results

@router.get("/{assessment_id}", response_model=AssessmentOut)
async def get_assessment(assessment_id: str, current_user: dict = Depends(get_current_user)):
    assessments_coll = get_assessments_collection()
    doc = assessments_coll.find_one({"id": assessment_id}) or assessments_coll.find_one({"_id": assessment_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment record not found")
        
    doc["id"] = str(doc.get("id") or doc.get("_id"))
    return AssessmentOut(**doc)

@router.post("/{assessment_id}/explanation")
async def generate_explanation_for_assessment(
    assessment_id: str,
    req: Optional[ExplanationRequest] = None,
    current_user: dict = Depends(get_current_user)
):
    """(Re)generate human-readable Gemini AI explanation for an assessment."""
    assessments_coll = get_assessments_collection()
    patients_coll = get_patients_collection()
    
    doc = assessments_coll.find_one({"id": assessment_id}) or assessments_coll.find_one({"_id": assessment_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
        
    patient = patients_coll.find_one({"id": doc.get("patient_id")})
    
    explanation = gemini_service.generate_explanation(
        prediction_label=doc.get("prediction_label", "Normal"),
        confidence=doc.get("confidence", 0.9),
        top_factors=doc.get("top_contributing_factors", []),
        input_data=doc.get("input_data", {}),
        patient_info=patient
    )
    
    # Save updated explanation
    assessments_coll.update_one({"id": assessment_id}, {"$set": {"explanation": explanation}})
    
    return {"explanation": explanation}
