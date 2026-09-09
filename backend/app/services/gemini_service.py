import os
import json
import requests
from typing import Dict, Any, List
from app.config import settings

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.model = settings.GEMINI_MODEL

    def _generate_rule_based_explanation(self, prediction_label: str, confidence: float, top_factors: List[Dict[str, Any]], input_data: Dict[str, float]) -> str:
        """Fallback clinical explanation generator when Gemini API key is not configured."""
        conf_pct = round(confidence * 100, 1)
        
        factor_summaries = []
        for f in top_factors[:3]:
            name = f.get("label", f.get("feature", ""))
            val = f.get("value", "")
            unit = f.get("unit", "")
            factor_summaries.append(f"• **{name}**: {val} {unit} (High model importance of {f.get('percentage', 0)}%)")
        
        factors_text = "\n".join(factor_summaries) if factor_summaries else "• CTG baseline parameters within measured boundaries."
        
        if prediction_label == "Normal":
            summary = (
                f"### Clinical Assessment Overview: Normal Category\n\n"
                f"The Cardiotocography (CTG) analysis indicates **reassuring fetal well-being** with a model confidence of **{conf_pct}%**.\n\n"
                f"#### Key Contributing Physiological Factors:\n{factors_text}\n\n"
                f"#### Interpretive Observations:\n"
                f"- Baseline heart rate and short/long-term variability align with physiological normative ranges.\n"
                f"- Presence of accelerations and absence of repetitive late or prolonged decelerations suggest adequate fetal oxygenation.\n\n"
                f"#### Recommended Clinical Actions:\n"
                f"- Continue standard antepartum / intrapartum monitoring protocol.\n"
                f"- Re-evaluate should maternal symptoms or clinical context shift."
            )
        elif prediction_label == "Suspect":
            summary = (
                f"### Clinical Assessment Overview: Suspect Category\n\n"
                f"The Cardiotocography (CTG) analysis indicates **atypical fetal patterns** requiring close surveillance, with a model confidence of **{conf_pct}%**.\n\n"
                f"#### Key Contributing Physiological Factors:\n{factors_text}\n\n"
                f"#### Interpretive Observations:\n"
                f"- Parameters show moderate deviation in baseline variability, contraction frequency, or acceleration patterns.\n"
                f"- While not overtly pathological, these signs warrant active evaluation to prevent potential hypoxic progression.\n\n"
                f"#### Recommended Clinical Actions:\n"
                f"- Initiate continuous CTG tracing and check maternal vitals (blood pressure, hydration, position).\n"
                f"- Consider biophysical profile or ultrasound assessment as clinically indicated."
            )
        else:
            summary = (
                f"### Clinical Assessment Overview: Pathological Category (Urgent)\n\n"
                f"The Cardiotocography (CTG) analysis indicates **critical abnormal fetal indicators** with a model confidence of **{conf_pct}%**.\n\n"
                f"#### Critical Contributing Risk Factors:\n{factors_text}\n\n"
                f"#### Interpretive Observations:\n"
                f"- Tracing reveals substantial abnormal variability, abnormal decelerations (severe or prolonged), or severe baseline anomalies.\n"
                f"- Pattern corresponds to an elevated probability of acute or chronic fetal hypoxia or acidemia.\n\n"
                f"#### Recommended Clinical Actions:\n"
                f"- Immediate obstetrician bedside evaluation.\n"
                f"- Institute intrauterine resuscitation measures (maternal left lateral positioning, IV hydration, maternal oxygen if indicated).\n"
                f"- Expedited diagnostic and delivery readiness assessment."
            )

        disclaimer = (
            "\n\n---\n"
            "*Disclaimer: This AI-generated assessment is an automated analytical aid for research and clinical decision support. "
            "It must not replace professional clinical judgment or formal medical diagnosis.*"
        )
        return summary + disclaimer

    def generate_explanation(
        self,
        prediction_label: str,
        confidence: float,
        top_factors: List[Dict[str, Any]],
        input_data: Dict[str, float],
        patient_info: Dict[str, Any] = None
    ) -> str:
        """Generate human-readable AI explanation via Gemini or clinical rule-based engine."""
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        
        if not api_key:
            return self._generate_rule_based_explanation(prediction_label, confidence, top_factors, input_data)

        # Build prompt for Gemini
        patient_str = ""
        if patient_info:
            patient_str = f"Patient Age: {patient_info.get('age', 'N/A')}, Gestational Age: {patient_info.get('pregnancy_week', 'N/A')} weeks.\n"

        factors_desc = ", ".join([f"{f.get('label')}: {f.get('value')} {f.get('unit')} (importance: {f.get('percentage')}%)" for f in top_factors[:5]])

        prompt = (
            "You are an expert obstetric AI decision-support assistant. "
            "A Machine Learning model evaluated a Cardiotocography (CTG) recording and classified it with the following structured results:\n"
            f"{patient_str}"
            f"- Classification: {prediction_label}\n"
            f"- Model Confidence: {round(confidence * 100, 1)}%\n"
            f"- Top Contributing Features: {factors_desc}\n\n"
            "Generate a clear, structured, clinical explanation for an obstetric healthcare provider. Include:\n"
            "1. Brief Summary of the CTG Classification\n"
            "2. Key Physiological Insights regarding the top contributing parameters\n"
            "3. Suggested Next Clinical Steps\n"
            "Use clean Markdown with bullet points. Do not make a definitive medical diagnosis. Keep it concise (under 250 words) "
            "and append a standard academic/clinical disclaimer at the end."
        )

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 600
                }
            }
            resp = requests.post(url, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
            else:
                print(f"[GeminiService] Gemini API returned status {resp.status_code}: {resp.text}")
                return self._generate_rule_based_explanation(prediction_label, confidence, top_factors, input_data)
        except Exception as e:
            print(f"[GeminiService] Gemini call failed ({e}), falling back to clinical rule engine.")
            return self._generate_rule_based_explanation(prediction_label, confidence, top_factors, input_data)

gemini_service = GeminiService()
