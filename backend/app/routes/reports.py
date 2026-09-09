from fastapi import APIRouter, HTTPException, status, Depends, Response
from app.services.database import get_assessments_collection, get_patients_collection
from app.services.pdf_service import pdf_service
from app.utils.security import get_current_user

router = APIRouter(tags=["Reports"])

@router.get("/assessments/{assessment_id}/report")
async def get_assessment_pdf_report(
    assessment_id: str,
    # Optional auth dependency - can also allow direct download link with token or header
):
    """Generate and download a professional PDF assessment report."""
    assessments_coll = get_assessments_collection()
    patients_coll = get_patients_collection()
    
    assessment = assessments_coll.find_one({"id": assessment_id}) or assessments_coll.find_one({"_id": assessment_id})
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
        
    patient = None
    if assessment.get("patient_id"):
        patient = patients_coll.find_one({"id": assessment.get("patient_id")}) or patients_coll.find_one({"_id": assessment.get("patient_id")})
        
    pdf_bytes = pdf_service.generate_assessment_report(assessment, patient)
    
    filename = f"fetal_health_assessment_{assessment_id[:8]}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
