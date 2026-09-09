from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class CTGInputSchema(BaseModel):
    # 21 CTG parameters
    baseline_value: float = Field(..., alias="baseline value", description="Baseline FHR (bpm)")
    accelerations: float = Field(..., description="Accelerations per second")
    fetal_movement: float = Field(..., description="Fetal movements per second")
    uterine_contractions: float = Field(..., description="Uterine contractions per second")
    light_decelerations: float = Field(..., description="Light decelerations per second")
    severe_decelerations: float = Field(..., description="Severe decelerations per second")
    prolongued_decelerations: float = Field(..., description="Prolonged decelerations per second")
    abnormal_short_term_variability: float = Field(..., description="Percentage ASTV (%)")
    mean_value_of_short_term_variability: float = Field(..., description="Mean STV")
    percentage_of_time_with_abnormal_long_term_variability: float = Field(..., description="Percentage ALTV (%)")
    mean_value_of_long_term_variability: float = Field(..., description="Mean LTV")
    histogram_width: float = Field(..., description="Histogram width")
    histogram_min: float = Field(..., description="Histogram min")
    histogram_max: float = Field(..., description="Histogram max")
    histogram_number_of_peaks: float = Field(..., description="Number of peaks")
    histogram_number_of_zeroes: float = Field(..., description="Number of zeroes")
    histogram_mode: float = Field(..., description="Histogram mode")
    histogram_mean: float = Field(..., description="Histogram mean")
    histogram_median: float = Field(..., description="Histogram median")
    histogram_variance: float = Field(..., description="Histogram variance")
    histogram_tendency: float = Field(..., description="Histogram tendency (-1, 0, 1)")

    class Config:
        populate_by_name = True
        extra = "allow"

class PredictionResponse(BaseModel):
    prediction: int  # 1: Normal, 2: Suspect, 3: Pathological
    prediction_label: str
    risk_level: str
    badge_color: str
    confidence: float
    probabilities: Dict[str, float]
    feature_importances: List[Dict[str, Any]]
    top_contributing_factors: List[Dict[str, Any]]
    input_data: Dict[str, float]
