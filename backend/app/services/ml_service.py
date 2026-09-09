import os
import sys
import warnings
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
import joblib

# Suppress sklearn unpickling version warnings
try:
    from sklearn.exceptions import InconsistentVersionWarning
    warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
except ImportError:
    pass

# Workaround for scikit-learn Cython unpickle loss path compatibility
try:
    import sklearn._loss._loss
    if "_loss" not in sys.modules:
        sys.modules["_loss"] = sklearn._loss._loss
except Exception:
    pass

from app.config import settings, PROJECT_ROOT, BASE_DIR
from app.utils.ctg_constants import (
    CTG_FEATURE_NAMES,
    TARGET_CLASSES,
    FEATURE_METADATA,
    SAMPLE_PRESETS
)

class MLService:
    def __init__(self):
        self.model = None
        self.feature_names = CTG_FEATURE_NAMES
        self.target_mapping = None
        self._load_model()

    def _find_model_file(self) -> Optional[Path]:
        candidates = [
            PROJECT_ROOT / "ml" / "models" / "fetal_health_model.pkl",
            BASE_DIR.parent / "ml" / "models" / "fetal_health_model.pkl",
            Path(settings.MODEL_PATH),
            Path(settings.MODEL_PATH).resolve(),
            PROJECT_ROOT / "fetal_health_model.pkl"
        ]
        for candidate in candidates:
            if candidate.is_file():
                return candidate
        return None

    def _load_model(self):
        model_file = self._find_model_file()
        if not model_file:
            print(f"[MLService] Warning: Model file not found at {settings.MODEL_PATH}")
            return

        try:
            loaded_data = joblib.load(str(model_file))
            if isinstance(loaded_data, dict):
                self.model = loaded_data.get("model")
                self.feature_names = loaded_data.get("feature_names", CTG_FEATURE_NAMES)
                self.target_mapping = loaded_data.get("target_mapping")
            else:
                self.model = loaded_data
            print(f"[MLService] Successfully loaded trained model from {model_file}")
        except Exception as e:
            print(f"[MLService] Error loading model from {model_file}: {e}")

    def is_ready(self) -> bool:
        return self.model is not None

    def get_feature_metadata(self) -> Dict[str, Any]:
        return {
            "features": FEATURE_METADATA,
            "feature_names": self.feature_names,
            "target_classes": TARGET_CLASSES,
            "presets": SAMPLE_PRESETS
        }

    def predict(self, input_dict: Dict[str, float]) -> Dict[str, Any]:
        """
        Execute prediction on CTG input dictionary.
        Returns prediction code, label, confidence, probabilities, and explainability factors.
        """
        if not self.is_ready():
            self._load_model()
            if not self.is_ready():
                raise RuntimeError("ML model is not loaded or available.")

        # Ensure all required features are present and numeric
        row_values = []
        for feature in self.feature_names:
            if feature not in input_dict:
                # Try fallback matching (e.g. spaces vs underscores)
                norm_key = feature.replace(" ", "_")
                if norm_key in input_dict:
                    val = float(input_dict[norm_key])
                else:
                    raise ValueError(f"Missing required CTG feature: '{feature}'")
            else:
                val = float(input_dict[feature])
            row_values.append(val)

        df_input = pd.DataFrame([row_values], columns=self.feature_names)

        # Run inference
        raw_pred = self.model.predict(df_input)[0]
        
        # Probabilities
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(df_input)[0]
        else:
            probs = [0.33, 0.33, 0.34]

        # Map prediction index/code to 1: Normal, 2: Suspect, 3: Pathological
        # Our target_mapping is {0: {'code': 1, 'label': 'Normal'}, 1: {'code': 2, 'label': 'Suspect'}, 2: {'code': 3, 'label': 'Pathological'}}
        if self.target_mapping and raw_pred in self.target_mapping:
            info = self.target_mapping[raw_pred]
            pred_code = int(info.get("code", raw_pred + 1))
            pred_label = info.get("label", "Normal")
        elif raw_pred in [0, 1, 2]:
            pred_code = int(raw_pred + 1)
            pred_label = TARGET_CLASSES[pred_code]["name"]
        else:
            pred_code = int(raw_pred)
            pred_label = TARGET_CLASSES.get(pred_code, {}).get("name", "Unknown")

        class_meta = TARGET_CLASSES.get(pred_code, TARGET_CLASSES[1])
        risk_level = class_meta["risk_level"]
        badge_color = class_meta["badge_color"]

        # Probability distribution dict
        prob_dict = {
            "Normal": round(float(probs[0]) if len(probs) > 0 else 0.0, 4),
            "Suspect": round(float(probs[1]) if len(probs) > 1 else 0.0, 4),
            "Pathological": round(float(probs[2]) if len(probs) > 2 else 0.0, 4)
        }
        
        # Main confidence is probability of predicted class
        pred_idx = pred_code - 1
        confidence = round(float(probs[pred_idx]) if pred_idx < len(probs) else max(prob_dict.values()), 4)

        # Compute Feature Importances & Explainability
        feature_importances = []
        if hasattr(self.model, "feature_importances_"):
            raw_importances = self.model.feature_importances_
            total_imp = sum(raw_importances) or 1.0
            for idx, feat_name in enumerate(self.feature_names):
                meta = FEATURE_METADATA.get(feat_name, {})
                norm_importance = float(raw_importances[idx]) / total_imp
                feature_importances.append({
                    "feature": feat_name,
                    "label": meta.get("label", feat_name),
                    "importance": round(norm_importance, 4),
                    "percentage": round(norm_importance * 100, 2),
                    "value": row_values[idx],
                    "unit": meta.get("unit", ""),
                    "category": meta.get("category", "General")
                })
            # Sort by importance descending
            feature_importances.sort(key=lambda x: x["importance"], reverse=True)

        top_factors = feature_importances[:5] if feature_importances else []

        return {
            "prediction": pred_code,
            "prediction_label": pred_label,
            "risk_level": risk_level,
            "badge_color": badge_color,
            "confidence": confidence,
            "probabilities": prob_dict,
            "feature_importances": feature_importances,
            "top_contributing_factors": top_factors,
            "input_data": dict(zip(self.feature_names, row_values))
        }

ml_service = MLService()
