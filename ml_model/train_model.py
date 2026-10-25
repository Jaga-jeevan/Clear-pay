"""
Banking Fraud Detection - Model Training & Evaluation
Trains an ML classification model on transactions_dataset.csv
Computes Accuracy, Precision, Recall, F1-Score, and exports feature weights.
Directly aligns with Backend/services/fraudScoringService.js.
"""

import csv
import json
import math
import random

def load_data(csv_path="transactions_dataset.csv"):
    X = []
    y = []
    feature_names = [
        "amount_ratio",
        "new_beneficiary",
        "velocity_score",
        "time_anomaly",
        "device_risk_score",  # 1 - device_trust_score
        "fraud_history"
    ]
    
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            features = [
                float(row["amount_ratio"]),
                float(row["new_beneficiary"]),
                float(row["velocity_score"]),
                float(row["time_anomaly"]),
                round(1.0 - float(row["device_trust_score"]), 2),
                float(row["fraud_history"])
            ]
            label = int(row["is_fraud"])
            X.append(features)
            y.append(label)
            
    return X, y, feature_names

def train_test_split(X, y, test_ratio=0.20, seed=42):
    random.seed(seed)
    indices = list(range(len(X)))
    random.shuffle(indices)
    
    split_idx = int(len(X) * (1 - test_ratio))
    train_idx = indices[:split_idx]
    test_idx = indices[split_idx:]
    
    X_train = [X[i] for i in train_idx]
    y_train = [y[i] for i in train_idx]
    X_test = [X[i] for i in test_idx]
    y_test = [y[i] for i in test_idx]
    
    return X_train, y_train, X_test, y_test

def sigmoid(z):
    z = max(-500, min(500, z))
    return 1.0 / (1.0 + math.exp(-z))

class FraudClassifier:
    """Logistic Regression & Gradient-Weighted Decision Classifier"""
    def __init__(self, num_features):
        self.weights = [0.0] * num_features
        self.bias = 0.0
        
    def fit(self, X, y, epochs=150, lr=0.05):
        m = len(X)
        num_features = len(self.weights)
        
        # Balance positive class with weighted loss (since fraud is ~6% of data)
        pos_weight = 4.0
        
        for epoch in range(epochs):
            dw = [0.0] * num_features
            db = 0.0
            
            for i in range(m):
                # Linear combination
                z = self.bias + sum(self.weights[j] * X[i][j] for j in range(num_features))
                y_pred = sigmoid(z)
                
                # Weighted error
                weight = pos_weight if y[i] == 1 else 1.0
                error = (y_pred - y[i]) * weight
                
                for j in range(num_features):
                    dw[j] += error * X[i][j]
                db += error
                
            # Gradient descent step
            for j in range(num_features):
                self.weights[j] -= (lr * dw[j]) / m
            self.bias -= (lr * db) / m
            
    def predict_proba(self, x):
        z = self.bias + sum(self.weights[j] * x[j] for j in range(len(self.weights)))
        return sigmoid(z)
        
    def predict(self, x, threshold=0.50):
        return 1 if self.predict_proba(x) >= threshold else 0

def evaluate_model(model, X_test, y_test, threshold=0.50):
    tp = fp = tn = fn = 0
    
    for i in range(len(X_test)):
        y_true = y_test[i]
        y_pred = model.predict(X_test[i], threshold=threshold)
        
        if y_true == 1 and y_pred == 1:
            tp += 1
        elif y_true == 0 and y_pred == 1:
            fp += 1
        elif y_true == 0 and y_pred == 0:
            tn += 1
        elif y_true == 1 and y_pred == 0:
            fn += 1
            
    total = len(X_test)
    accuracy = (tp + tn) / total if total > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "confusion_matrix": {
            "TP": tp, "FP": fp, "TN": tn, "FN": fn
        }
    }

def main():
    print("==================================================")
    print("ClearPay Banking Fraud Detection - ML Training")
    print("==================================================")
    
    # 1. Load Dataset
    print("\n[Step 1] Loading dataset...")
    X, y, feature_names = load_data("transactions_dataset.csv")
    print(f"Total dataset size: {len(X)} records")
    print(f"Features: {feature_names}")
    
    # 2. Train / Test Split
    print("\n[Step 2] Splitting into 80% Train, 20% Test...")
    X_train, y_train, X_test, y_test = train_test_split(X, y, test_ratio=0.20, seed=42)
    print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}")
    
    # 3. Model Training
    print("\n[Step 3] Training Supervised Fraud Classifier...")
    model = FraudClassifier(num_features=len(feature_names))
    model.fit(X_train, y_train, epochs=200, lr=0.08)
    print("Training complete!")
    
    # 4. Evaluation
    print("\n[Step 4] Evaluating Model on Test Set...")
    metrics = evaluate_model(model, X_test, y_test, threshold=0.50)
    
    print("-" * 50)
    print(f"Accuracy  : {metrics['accuracy'] * 100:.2f}%")
    print(f"Precision : {metrics['precision'] * 100:.2f}%")
    print(f"Recall    : {metrics['recall'] * 100:.2f}%")
    print(f"F1-Score  : {metrics['f1_score'] * 100:.2f}%")
    print(f"Confusion Matrix: TP={metrics['confusion_matrix']['TP']}, FP={metrics['confusion_matrix']['FP']}, TN={metrics['confusion_matrix']['TN']}, FN={metrics['confusion_matrix']['FN']}")
    print("-" * 50)
    
    # 5. Feature Importances / Weights
    print("\n[Step 5] Extracted Feature Importance Weights:")
    total_w = sum(abs(w) for w in model.weights) or 1.0
    relative_weights = {}
    for name, w in zip(feature_names, model.weights):
        normalized_w = round(abs(w) / total_w, 3)
        relative_weights[name] = normalized_w
        print(f"  * {name:<20}: Weight = {w:+.4f} (Importance: {normalized_w * 100:.1f}%)")
        
    # 6. Save Artifacts
    model_output = {
        "model_type": "Logistic Regression / Weighted Feature Ensemble",
        "dataset": "transactions_dataset.csv (10,000 samples)",
        "features": feature_names,
        "weights": model.weights,
        "bias": model.bias,
        "relative_importance": relative_weights,
        "performance_metrics": metrics
    }
    
    with open("model_weights.json", "w", encoding="utf-8") as f:
        json.dump(model_output, f, indent=2)
    print("\n[Step 6] Model weights saved to 'model_weights.json'")
    
    # 7. Sample Inference
    print("\n[Step 7] Real-Time Inference Demo:")
    sample_safe = [1.05, 0.0, 1.0, 0.0, 0.10, 0.0]  # Normal grocery purchase
    sample_fraud = [4.80, 1.0, 4.0, 1.0, 0.75, 1.0] # High amount spike to new user at midnight
    
    p_safe = model.predict_proba(sample_safe)
    p_fraud = model.predict_proba(sample_fraud)
    
    print(f"  Sample A (Grocery, known user, noon): Fraud Prob = {p_safe * 100:.1f}% -> {'FLAGGED' if p_safe >= 0.5 else 'APPROVED'}")
    print(f"  Sample B (Spike, new beneficiary, 2 AM): Fraud Prob = {p_fraud * 100:.1f}% -> {'FLAGGED' if p_fraud >= 0.5 else 'APPROVED'}")
    print("==================================================")

if __name__ == "__main__":
    main()
