"""
CTG Feature Definitions, Metadata, and Test Presets
Matching the 21 Kaggle Fetal Health Dataset attributes.
"""

CTG_FEATURE_NAMES = [
    "baseline value",
    "accelerations",
    "fetal_movement",
    "uterine_contractions",
    "light_decelerations",
    "severe_decelerations",
    "prolongued_decelerations",
    "abnormal_short_term_variability",
    "mean_value_of_short_term_variability",
    "percentage_of_time_with_abnormal_long_term_variability",
    "mean_value_of_long_term_variability",
    "histogram_width",
    "histogram_min",
    "histogram_max",
    "histogram_number_of_peaks",
    "histogram_number_of_zeroes",
    "histogram_mode",
    "histogram_mean",
    "histogram_median",
    "histogram_variance",
    "histogram_tendency"
]

TARGET_CLASSES = {
    1: {"code": 1, "name": "Normal", "risk_level": "Low Risk", "badge_color": "green", "description": "Fetal heart rate patterns and variability reflect reassuring fetal well-being."},
    2: {"code": 2, "name": "Suspect", "risk_level": "Moderate Risk", "badge_color": "amber", "description": "Features deviate from normal baselines; warrants close clinical monitoring and further CTG tracing evaluation."},
    3: {"code": 3, "name": "Pathological", "risk_level": "High Risk", "badge_color": "red", "description": "High likelihood of fetal distress, acidemia, or hypoxia; urgent clinical assessment required."}
}

# Human-readable labels and descriptions for CTG features
FEATURE_METADATA = {
    "baseline value": {
        "label": "Baseline FHR",
        "unit": "bpm",
        "description": "Baseline Fetal Heart Rate (normal range: 110-160 bpm)",
        "min": 100.0, "max": 180.0, "step": 1.0,
        "category": "Baseline & Uterine Activity"
    },
    "accelerations": {
        "label": "Accelerations",
        "unit": "/sec",
        "description": "Number of accelerations per second (reassuring sign)",
        "min": 0.0, "max": 0.05, "step": 0.001,
        "category": "Baseline & Uterine Activity"
    },
    "fetal_movement": {
        "label": "Fetal Movements",
        "unit": "/sec",
        "description": "Number of detected fetal movements per second",
        "min": 0.0, "max": 0.5, "step": 0.001,
        "category": "Baseline & Uterine Activity"
    },
    "uterine_contractions": {
        "label": "Uterine Contractions",
        "unit": "/sec",
        "description": "Number of uterine contractions per second",
        "min": 0.0, "max": 0.03, "step": 0.001,
        "category": "Baseline & Uterine Activity"
    },
    "light_decelerations": {
        "label": "Light Decelerations",
        "unit": "/sec",
        "description": "Number of light decelerations per second",
        "min": 0.0, "max": 0.03, "step": 0.001,
        "category": "Decelerations"
    },
    "severe_decelerations": {
        "label": "Severe Decelerations",
        "unit": "/sec",
        "description": "Number of severe decelerations per second (distress indicator)",
        "min": 0.0, "max": 0.01, "step": 0.001,
        "category": "Decelerations"
    },
    "prolongued_decelerations": {
        "label": "Prolonged Decelerations",
        "unit": "/sec",
        "description": "Number of prolonged decelerations per second",
        "min": 0.0, "max": 0.01, "step": 0.001,
        "category": "Decelerations"
    },
    "abnormal_short_term_variability": {
        "label": "Abnormal STV (%)",
        "unit": "%",
        "description": "Percentage of time with abnormal short-term variability",
        "min": 0.0, "max": 100.0, "step": 1.0,
        "category": "Variability Metrics"
    },
    "mean_value_of_short_term_variability": {
        "label": "Mean STV",
        "unit": "bpm",
        "description": "Mean value of short-term variability",
        "min": 0.0, "max": 10.0, "step": 0.1,
        "category": "Variability Metrics"
    },
    "percentage_of_time_with_abnormal_long_term_variability": {
        "label": "Abnormal LTV (%)",
        "unit": "%",
        "description": "Percentage of time with abnormal long-term variability",
        "min": 0.0, "max": 100.0, "step": 1.0,
        "category": "Variability Metrics"
    },
    "mean_value_of_long_term_variability": {
        "label": "Mean LTV",
        "unit": "bpm",
        "description": "Mean value of long-term variability",
        "min": 0.0, "max": 60.0, "step": 0.1,
        "category": "Variability Metrics"
    },
    "histogram_width": {
        "label": "Histogram Width",
        "unit": "bpm",
        "description": "Width of the FHR histogram",
        "min": 0.0, "max": 250.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_min": {
        "label": "Histogram Min",
        "unit": "bpm",
        "description": "Minimum value in the FHR histogram",
        "min": 30.0, "max": 200.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_max": {
        "label": "Histogram Max",
        "unit": "bpm",
        "description": "Maximum value in the FHR histogram",
        "min": 50.0, "max": 260.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_number_of_peaks": {
        "label": "Number of Peaks",
        "unit": "count",
        "description": "Number of histogram peaks",
        "min": 0.0, "max": 25.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_number_of_zeroes": {
        "label": "Number of Zeroes",
        "unit": "count",
        "description": "Number of histogram zeroes",
        "min": 0.0, "max": 15.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_mode": {
        "label": "Histogram Mode",
        "unit": "bpm",
        "description": "Histogram modal value",
        "min": 50.0, "max": 200.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_mean": {
        "label": "Histogram Mean",
        "unit": "bpm",
        "description": "Histogram mean value",
        "min": 50.0, "max": 200.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_median": {
        "label": "Histogram Median",
        "unit": "bpm",
        "description": "Histogram median value",
        "min": 50.0, "max": 200.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_variance": {
        "label": "Histogram Variance",
        "unit": "",
        "description": "Histogram variance measure",
        "min": 0.0, "max": 300.0, "step": 1.0,
        "category": "Histogram Features"
    },
    "histogram_tendency": {
        "label": "Histogram Tendency",
        "unit": "",
        "description": "Histogram asymmetry: -1=Left asymmetric, 0=Symmetric, 1=Right asymmetric",
        "min": -1.0, "max": 1.0, "step": 1.0,
        "category": "Histogram Features"
    }
}

# Real sample test cases extracted from Kaggle CTG dataset for quick testing
SAMPLE_PRESETS = {
    "normal": {
        "baseline value": 132.0,
        "accelerations": 0.006,
        "fetal_movement": 0.0,
        "uterine_contractions": 0.006,
        "light_decelerations": 0.003,
        "severe_decelerations": 0.0,
        "prolongued_decelerations": 0.0,
        "abnormal_short_term_variability": 17.0,
        "mean_value_of_short_term_variability": 2.1,
        "percentage_of_time_with_abnormal_long_term_variability": 0.0,
        "mean_value_of_long_term_variability": 10.4,
        "histogram_width": 130.0,
        "histogram_min": 68.0,
        "histogram_max": 198.0,
        "histogram_number_of_peaks": 6.0,
        "histogram_number_of_zeroes": 1.0,
        "histogram_mode": 141.0,
        "histogram_mean": 136.0,
        "histogram_median": 140.0,
        "histogram_variance": 12.0,
        "histogram_tendency": 0.0
    },
    "suspect": {
        "baseline value": 142.0,
        "accelerations": 0.001,
        "fetal_movement": 0.0,
        "uterine_contractions": 0.001,
        "light_decelerations": 0.0,
        "severe_decelerations": 0.0,
        "prolongued_decelerations": 0.0,
        "abnormal_short_term_variability": 65.0,
        "mean_value_of_short_term_variability": 0.5,
        "percentage_of_time_with_abnormal_long_term_variability": 24.0,
        "mean_value_of_long_term_variability": 7.3,
        "histogram_width": 27.0,
        "histogram_min": 130.0,
        "histogram_max": 157.0,
        "histogram_number_of_peaks": 1.0,
        "histogram_number_of_zeroes": 0.0,
        "histogram_mode": 144.0,
        "histogram_mean": 143.0,
        "histogram_median": 145.0,
        "histogram_variance": 1.0,
        "histogram_tendency": 0.0
    },
    "pathological": {
        "baseline value": 120.0,
        "accelerations": 0.0,
        "fetal_movement": 0.0,
        "uterine_contractions": 0.001,
        "light_decelerations": 0.002,
        "severe_decelerations": 0.0,
        "prolongued_decelerations": 0.005,
        "abnormal_short_term_variability": 73.0,
        "mean_value_of_short_term_variability": 0.5,
        "percentage_of_time_with_abnormal_long_term_variability": 43.0,
        "mean_value_of_long_term_variability": 4.0,
        "histogram_width": 64.0,
        "histogram_min": 62.0,
        "histogram_max": 126.0,
        "histogram_number_of_peaks": 2.0,
        "histogram_number_of_zeroes": 0.0,
        "histogram_mode": 105.0,
        "histogram_mean": 99.0,
        "histogram_median": 104.0,
        "histogram_variance": 10.0,
        "histogram_tendency": 0.0
    }
}
