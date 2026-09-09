# AI-Based Fetal Health Monitoring and Risk Prediction System
### Major Project Implementation using Machine Learning & Generative AI

A full-stack intelligent healthcare decision-support system designed to evaluate Cardiotocography (CTG) monitoring parameters and classify fetal status into **Normal**, **Suspect**, or **Pathological** categories.

The platform integrates:
- **Machine Learning**: Pre-trained Scikit-Learn `GradientBoostingClassifier` trained on the Kaggle Fetal Health dataset.
- **Explainable AI (XAI)**: Physiological feature importance extraction and top contributing risk factors.
- **Generative AI (Gemini)**: Clinical explanation narratives synthesizing model probabilities into structured physician summaries.
- **FastAPI REST Backend**: High-performance asynchronous API architecture with JWT authentication and PyMongo data persistence.
- **React.js & Tailwind CSS Frontend**: Clinical dashboard, patient records management, dynamic CTG parameter entry, and Recharts data visualizations.
- **ReportLab PDF Engine**: Instant clinical assessment report generation and export.

---

## 1. Project Directory Structure

```text
fetal-health-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExplanationPanel.jsx
│   │   │   ├── FeatureImportanceChart.jsx
│   │   │   ├── ProbabilityGauge.jsx
│   │   │   └── RiskBadge.jsx
│   │   ├── pages/
│   │   │   ├── AssessmentHistory.jsx
│   │   │   ├── AssessmentResult.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ModelInfo.jsx
│   │   │   ├── NewAssessment.jsx
│   │   │   ├── PatientDetail.jsx
│   │   │   ├── PatientList.jsx
│   │   │   └── Register.jsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── patient.py
│   │   │   └── assessment.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── patient.py
│   │   │   ├── assessment.py
│   │   │   └── prediction.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── patients.py
│   │   │   ├── assessments.py
│   │   │   ├── predictions.py
│   │   │   └── reports.py
│   │   ├── services/
│   │   │   ├── ml_service.py
│   │   │   ├── gemini_service.py
│   │   │   ├── pdf_service.py
│   │   │   └── database.py
│   │   └── utils/
│   │       ├── security.py
│   │       └── ctg_constants.py
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
├── ml/
│   ├── data/
│   │   └── fetal_health.csv
│   ├── notebooks/
│   │   └── fetal_health_eda_training.ipynb
│   ├── train.py
│   ├── preprocess.py
│   ├── evaluate.py
│   └── models/
│       └── fetal_health_model.pkl
├── reports/
├── README.md
└── .gitignore
```

---

## 2. Machine Learning Model Integration

The model file is stored at:
`ml/models/fetal_health_model.pkl`

- **Algorithm**: `GradientBoostingClassifier`
- **Features (21 CTG measurements)**:
  1. `baseline value` (Baseline Fetal Heart Rate, bpm)
  2. `accelerations` (Accelerations per second)
  3. `fetal_movement` (Fetal movements per second)
  4. `uterine_contractions` (Uterine contractions per second)
  5. `light_decelerations` (Light decelerations per second)
  6. `severe_decelerations` (Severe decelerations per second)
  7. `prolongued_decelerations` (Prolonged decelerations per second)
  8. `abnormal_short_term_variability` (Percentage ASTV)
  9. `mean_value_of_short_term_variability` (Mean STV)
  10. `percentage_of_time_with_abnormal_long_term_variability` (Percentage ALTV)
  11. `mean_value_of_long_term_variability` (Mean LTV)
  12. `histogram_width` (Histogram dynamic range)
  13. `histogram_min` (Histogram minimum)
  14. `histogram_max` (Histogram maximum)
  15. `histogram_number_of_peaks` (Histogram peak count)
  16. `histogram_number_of_zeroes` (Histogram zero count)
  17. `histogram_mode` (Histogram modal value)
  18. `histogram_mean` (Histogram mean value)
  19. `histogram_median` (Histogram median value)
  20. `histogram_variance` (Histogram dispersion)
  21. `histogram_tendency` (Histogram asymmetry: -1, 0, 1)
- **Target Classes**:
  - `1`: **Normal** (Low Risk)
  - `2`: **Suspect** (Moderate Risk)
  - `3`: **Pathological** (High Risk)

---

## 3. Quick Start Guide

### Step 1: Start Backend (FastAPI)
```bash
# In backend directory
cd backend

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run FastAPI development server
python -m uvicorn app.main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Step 2: Start Frontend (React + Vite)
```bash
# In frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- Frontend Web Interface: [http://localhost:5173](http://localhost:5173)

---

## 4. API Endpoints Reference

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Register clinician user account |
| **Auth** | `/api/auth/login` | `POST` | Authenticate user & receive JWT token |
| **Auth** | `/api/auth/me` | `GET` | Retrieve current authenticated clinician profile |
| **Patients** | `/api/patients` | `POST` | Enroll new pregnant patient record |
| **Patients** | `/api/patients` | `GET` | List all enrolled patients |
| **Patients** | `/api/patients/{id}` | `GET` | Get patient details and latest assessment |
| **Patients** | `/api/patients/{id}` | `PUT` | Update patient record |
| **Patients** | `/api/patients/{id}` | `DELETE` | Remove patient record and tests |
| **Assessments** | `/api/assessments` | `POST` | Create assessment (runs ML + AI explanation) |
| **Assessments** | `/api/assessments` | `GET` | List all historical assessments |
| **Assessments** | `/api/assessments/{id}` | `GET` | Get detailed assessment record |
| **Assessments** | `/api/assessments/stats/summary` | `GET` | Summary statistics and charts telemetry |
| **Assessments** | `/api/patients/{id}/assessments`| `GET` | Get assessment history for specific patient |
| **Predictions** | `/api/predictions` | `POST` | Direct ML inference on 21 CTG features |
| **Predictions** | `/api/predictions/metadata` | `GET` | Feature ranges, units, and presets |
| **AI Explanation**| `/api/assessments/{id}/explanation` | `POST` | (Re)generate Gemini AI explanation |
| **Reports** | `/api/assessments/{id}/report` | `GET` | Download ReportLab generated clinical PDF |

---

## 5. Medical & Academic Disclaimer
This project is an academic prototype intended for demonstration, research, and educational purposes. The Machine Learning output represents a classification based on patterns learned from the Kaggle CTG dataset and must not be presented as a clinical diagnosis. The Generative AI component is intended only to explain the model output in natural language and must not be used to make independent medical decisions. Professional healthcare evaluation remains necessary for real-world clinical use.
