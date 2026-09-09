"""
Model Evaluation Module for Fetal Health Classification
Computes Accuracy, Precision, Recall, F1-Score, and Confusion Matrix as specified in Section 6.
"""
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

def evaluate_model(model, X_test, y_test, class_names=None):
    """Compute and format full evaluation metrics."""
    class_names = class_names or ["Normal", "Suspect", "Pathological"]
    
    y_pred = model.predict(X_test)
    
    # Handle both 0-indexed and 1-indexed target classes
    if np.min(y_test) == 1 and np.min(y_pred) == 0:
        y_test_eval = y_test - 1
    elif np.min(y_test) == 0 and np.min(y_pred) == 1:
        y_test_eval = y_test + 1
    else:
        y_test_eval = y_test

    acc = accuracy_score(y_test_eval, y_pred)
    prec = precision_score(y_test_eval, y_pred, average="weighted", zero_division=0)
    rec = recall_score(y_test_eval, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test_eval, y_pred, average="weighted", zero_division=0)
    cm = confusion_matrix(y_test_eval, y_pred)
    cr = classification_report(y_test_eval, y_pred, target_names=class_names, output_dict=True)

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": cm.tolist(),
        "classification_report": cr
    }

    print("==================================================")
    print("        FETAL HEALTH MODEL EVALUATION REPORT       ")
    print("==================================================")
    print(f"Accuracy:  {metrics['accuracy'] * 100:.2f}%")
    print(f"Precision: {metrics['precision'] * 100:.2f}%")
    print(f"Recall:    {metrics['recall'] * 100:.2f}%")
    print(f"F1-Score:  {metrics['f1_score'] * 100:.2f}%")
    print("\nConfusion Matrix:")
    print(np.array(metrics["confusion_matrix"]))
    print("\nPer-Class Breakdown:")
    for cls in class_names:
        if cls in cr:
            c = cr[cls]
            print(f"  {cls:<14}: Precision={c['precision']:.3f}, Recall={c['recall']:.3f}, F1={c['f1-score']:.3f}")
    print("==================================================")
    return metrics

if __name__ == "__main__":
    print("Evaluation module ready.")
