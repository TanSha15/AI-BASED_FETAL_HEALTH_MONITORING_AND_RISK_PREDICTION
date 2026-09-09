"""
Backend Test Suite verifying FastAPI endpoints, ML inference, Database operations, and PDF generation.
"""
import os
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from app.main import app
from app.utils.ctg_constants import SAMPLE_PRESETS

client = TestClient(app)

def test_health_and_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["model_loaded"] is True

    res2 = client.get("/api/health")
    assert res2.status_code == 200
    assert res2.json()["model_ready"] is True

def test_prediction_endpoint():
    payload = SAMPLE_PRESETS["normal"]
    res = client.post("/api/predictions", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["prediction"] == 1
    assert data["prediction_label"] == "Normal"
    assert "confidence" in data
    assert len(data["top_contributing_factors"]) > 0

    # Test suspect preset
    res_suspect = client.post("/api/predictions", json=SAMPLE_PRESETS["suspect"])
    assert res_suspect.status_code == 200
    assert res_suspect.json()["prediction_label"] == "Suspect"

    # Test pathological preset
    res_patho = client.post("/api/predictions", json=SAMPLE_PRESETS["pathological"])
    assert res_patho.status_code == 200
    assert res_patho.json()["prediction_label"] == "Pathological"

def test_auth_flow():
    email = f"test_doctor_{os.urandom(4).hex()}@hospital.org"
    register_payload = {
        "name": "Dr. Sarah Jenkins",
        "email": email,
        "password": "SecurePassword123!",
        "role": "Chief Obstetrician"
    }
    reg_res = client.post("/api/auth/register", json=register_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    token = reg_data["access_token"]

    # Test login
    login_res = client.post("/api/auth/login", json={"email": email, "password": "SecurePassword123!"})
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Test /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Dr. Sarah Jenkins"

    return token

def test_patient_and_assessment_crud():
    token = test_auth_flow()
    headers = {"Authorization": f"Bearer {token}"}

    # Create patient
    p_payload = {
        "name": "Elena Rostova",
        "age": 28,
        "pregnancy_week": 34,
        "contact": "+1 (555) 349-2810",
        "blood_group": "O+",
        "medical_history": "Nulliparous, uncomplicated singleton gestation"
    }
    p_res = client.post("/api/patients", json=p_payload, headers=headers)
    assert p_res.status_code == 201
    patient = p_res.json()
    patient_id = patient["id"]
    assert patient["name"] == "Elena Rostova"

    # List patients
    list_res = client.get("/api/patients", headers=headers)
    assert list_res.status_code == 200
    assert any(p["id"] == patient_id for p in list_res.json())

    # Create assessment
    a_payload = {
        "patient_id": patient_id,
        "input_data": SAMPLE_PRESETS["normal"],
        "notes": "Routine weekly antepartum cardiotocogram recording."
    }
    a_res = client.post("/api/assessments", json=a_payload, headers=headers)
    assert a_res.status_code == 201
    assessment = a_res.json()
    assessment_id = assessment["id"]
    assert assessment["prediction_label"] == "Normal"
    assert assessment["patient_name"] == "Elena Rostova"
    assert len(assessment["explanation"]) > 0

    # Get assessment
    get_a = client.get(f"/api/assessments/{assessment_id}", headers=headers)
    assert get_a.status_code == 200
    assert get_a.json()["id"] == assessment_id

    # Get patient assessments
    p_a = client.get(f"/api/patients/{patient_id}/assessments", headers=headers)
    assert p_a.status_code == 200
    assert len(p_a.json()) >= 1

    # Test PDF report download
    pdf_res = client.get(f"/api/assessments/{assessment_id}/report")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert pdf_res.content.startswith(b"%PDF")
    print(f"[OK] PDF successfully generated with size: {len(pdf_res.content)} bytes")

if __name__ == "__main__":
    print("Running backend tests...")
    test_health_and_root()
    print("[OK] test_health_and_root passed")
    test_prediction_endpoint()
    print("[OK] test_prediction_endpoint passed")
    test_patient_and_assessment_crud()
    print("[OK] All backend tests passed successfully!")
