"""
Fetal Health Model Training & Serialization Script
Documents the training pipeline for GradientBoostingClassifier on the 21 Kaggle CTG features.
"""
import os
import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from ml.preprocess import CTG_COLUMNS, TARGET_COLUMN, load_and_clean_data, split_features_and_target
from ml.evaluate import evaluate_model

TARGET_MAPPING = {
    0: {"code": 1, "label": "Normal"},
    1: {"code": 2, "label": "Suspect"},
    2: {"code": 3, "label": "Pathological"}
}

def train_fetal_health_model(data_path: str = "ml/data/fetal_health.csv", output_path: str = "ml/models/fetal_health_model.pkl"):
    if not os.path.exists(data_path):
        print(f"Data file not found at {data_path}. Using existing serialized model at {output_path}.")
        return

    df = load_and_clean_data(data_path)
    X_train, X_test, y_train, y_test = split_features_and_target(df)

    # Convert 1-indexed targets (1, 2, 3) to 0-indexed (0, 1, 2)
    y_train_idx = y_train - 1
    y_test_idx = y_test - 1

    print("Training GradientBoostingClassifier...")
    model = GradientBoostingClassifier(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=5,
        random_state=42
    )
    model.fit(X_train, y_train_idx)

    print("Evaluating trained model...")
    evaluate_model(model, X_test, y_test_idx)

    # Save model dictionary with feature names and target mapping
    model_artifact = {
        "model": model,
        "feature_names": CTG_COLUMNS,
        "target_mapping": TARGET_MAPPING
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    joblib.dump(model_artifact, output_path)
    print(f"✓ Model successfully serialized and saved to {output_path}")

if __name__ == "__main__":
    print("Training module configured.")
