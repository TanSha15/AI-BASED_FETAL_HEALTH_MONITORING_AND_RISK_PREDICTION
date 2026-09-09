"""
Data Preprocessing Pipeline for Fetal Health Classification
Handles CTG dataset loading, feature inspection, missing values, and train/test splits.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

CTG_COLUMNS = [
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

TARGET_COLUMN = "fetal_health"

def load_and_clean_data(filepath: str) -> pd.DataFrame:
    """Load Kaggle fetal health CSV and clean duplicates / missing values."""
    df = pd.read_csv(filepath)
    print(f"Initial raw shape: {df.shape}")
    
    # Drop duplicates
    initial_len = len(df)
    df = df.drop_duplicates()
    print(f"Removed {initial_len - len(df)} duplicate records.")
    
    # Handle missing values if any
    df = df.dropna()
    print(f"Cleaned dataset shape: {df.shape}")
    return df

def split_features_and_target(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    """Split dataset into stratified train and test subsets."""
    X = df[CTG_COLUMNS]
    y = df[TARGET_COLUMN]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    print(f"Training features: {X_train.shape}, Test features: {X_test.shape}")
    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    print("Preprocessing module ready.")
