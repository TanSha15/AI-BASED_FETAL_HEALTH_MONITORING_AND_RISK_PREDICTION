import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.patient import PatientCreate, PatientUpdate, PatientOut
from app.services.database import get_patients_collection, get_assessments_collection
from app.utils.security import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
async def create_patient(patient_in: PatientCreate, current_user: dict = Depends(get_current_user)):
    patients_coll = get_patients_collection()
    patient_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "_id": patient_id,
        "id": patient_id,
        "name": patient_in.name.strip(),
        "age": patient_in.age,
        "pregnancy_week": patient_in.pregnancy_week,
        "contact": patient_in.contact or "",
        "blood_group": patient_in.blood_group or "",
        "medical_history": patient_in.medical_history or "",
        "notes": patient_in.notes or "",
        "created_by": current_user["id"],
        "created_at": now_iso
    }
    
    patients_coll.insert_one(doc)
    
    return PatientOut(
        id=patient_id,
        name=doc["name"],
        age=doc["age"],
        pregnancy_week=doc["pregnancy_week"],
        contact=doc["contact"],
        blood_group=doc["blood_group"],
        medical_history=doc["medical_history"],
        notes=doc["notes"],
        created_at=doc["created_at"],
        total_assessments=0,
        latest_assessment=None
    )

@router.get("", response_model=List[PatientOut])
async def list_patients(current_user: dict = Depends(get_current_user)):
    patients_coll = get_patients_collection()
    assessments_coll = get_assessments_collection()
    
    patients = list(patients_coll.find().sort("created_at", -1))
    results = []
    
    for p in patients:
        pid = str(p.get("id") or p.get("_id"))
        # Get count of assessments for this patient
        p_assessments = list(assessments_coll.find({"patient_id": pid}).sort("created_at", -1))
        latest = p_assessments[0] if p_assessments else None
        
        results.append(PatientOut(
            id=pid,
            name=p.get("name", ""),
            age=p.get("age", 0),
            pregnancy_week=p.get("pregnancy_week", 0),
            contact=p.get("contact", ""),
            blood_group=p.get("blood_group", ""),
            medical_history=p.get("medical_history", ""),
            notes=p.get("notes", ""),
            created_at=p.get("created_at"),
            total_assessments=len(p_assessments),
            latest_assessment=latest
        ))
        
    return results

@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(patient_id: str, current_user: dict = Depends(get_current_user)):
    patients_coll = get_patients_collection()
    assessments_coll = get_assessments_collection()
    
    patient = patients_coll.find_one({"id": patient_id})
    if not patient:
        patient = patients_coll.find_one({"_id": patient_id})
        
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        
    pid = str(patient.get("id") or patient.get("_id"))
    p_assessments = list(assessments_coll.find({"patient_id": pid}).sort("created_at", -1))
    latest = p_assessments[0] if p_assessments else None
    
    return PatientOut(
        id=pid,
        name=patient.get("name", ""),
        age=patient.get("age", 0),
        pregnancy_week=patient.get("pregnancy_week", 0),
        contact=patient.get("contact", ""),
        blood_group=patient.get("blood_group", ""),
        medical_history=patient.get("medical_history", ""),
        notes=patient.get("notes", ""),
        created_at=patient.get("created_at"),
        total_assessments=len(p_assessments),
        latest_assessment=latest
    )

@router.put("/{patient_id}", response_model=PatientOut)
async def update_patient(patient_id: str, update_in: PatientUpdate, current_user: dict = Depends(get_current_user)):
    patients_coll = get_patients_collection()
    
    patient = patients_coll.find_one({"id": patient_id}) or patients_coll.find_one({"_id": patient_id})
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        
    update_data = {k: v for k, v in update_in.model_dump().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        patients_coll.update_one({"id": patient_id}, {"$set": update_data})
        
    updated = patients_coll.find_one({"id": patient_id}) or patients_coll.find_one({"_id": patient_id})
    return PatientOut(
        id=str(updated.get("id") or updated.get("_id")),
        name=updated.get("name", ""),
        age=updated.get("age", 0),
        pregnancy_week=updated.get("pregnancy_week", 0),
        contact=updated.get("contact", ""),
        blood_group=updated.get("blood_group", ""),
        medical_history=updated.get("medical_history", ""),
        notes=updated.get("notes", ""),
        created_at=updated.get("created_at")
    )

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(patient_id: str, current_user: dict = Depends(get_current_user)):
    patients_coll = get_patients_collection()
    assessments_coll = get_assessments_collection()
    
    res = patients_coll.delete_one({"id": patient_id})
    if res.deleted_count == 0:
        res = patients_coll.delete_one({"_id": patient_id})
        
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        
    # Also clean up associated assessments if any
    assessments = list(assessments_coll.find({"patient_id": patient_id}))
    for a in assessments:
        aid = a.get("id") or a.get("_id")
        assessments_coll.delete_one({"id": aid})
        
    return None

@router.get("/{patient_id}/assessments")
async def get_patient_assessments(patient_id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve all historical assessments for a specific patient."""
    patients_coll = get_patients_collection()
    assessments_coll = get_assessments_collection()
    
    patient = patients_coll.find_one({"id": patient_id}) or patients_coll.find_one({"_id": patient_id})
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
        
    docs = list(assessments_coll.find({"patient_id": patient_id}).sort("created_at", -1))
    for d in docs:
        d["id"] = str(d.get("id") or d.get("_id"))
    return docs

