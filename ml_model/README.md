# 🧠 ClearPay Machine Learning Fraud Detection Model

This folder contains the **offline dataset generation and machine learning training pipeline** that forms the basis for ClearPay's real-time fraud scoring engine ([`Backend/services/fraudScoringService.js`](../Backend/services/fraudScoringService.js)).

---

## 📁 Files Included

| File | Description |
| :--- | :--- |
| **[`transactions_dataset.csv`](./transactions_dataset.csv)** | Generated financial dataset containing **10,000 transaction records** (9,400 legitimate, 600 fraudulent). |
| **[`generate_dataset.py`](./generate_dataset.py)** | Python script that generates the synthetic banking transactions modeled on PaySim/Kaggle financial fraud benchmarks. |
| **[`train_model.py`](./train_model.py)** | Python ML script that loads the dataset, splits 80/20 train-test, trains a supervised fraud classifier, evaluates accuracy/precision/recall, and extracts feature weights. |
| **[`model_weights.json`](./model_weights.json)** | Exported weights, feature importance percentages, and evaluation metrics produced by model training. |

---

## 📊 Dataset Schema

Each row in `transactions_dataset.csv` contains:

1. `transaction_id`: Unique identifier (e.g., `TXN_100001`)
2. `user_id`: Account identifier
3. `amount`: Transaction value in INR (₹)
4. `avg_user_amount`: User's baseline historical average transaction amount
5. `amount_ratio`: Ratio of current transaction to historical average (`amount / avg_user_amount`)
6. `new_beneficiary`: Binary indicator (`1` if transfer is to an unfamiliar beneficiary, `0` if established)
7. `velocity_score`: Number of transactions initiated within a short time window (1 hour)
8. `time_anomaly`: Binary indicator (`1` if transaction occurs during high-risk hours like 11 PM – 5 AM, `0` otherwise)
9. `device_trust_score`: Score between `0.1` and `1.0` reflecting device recognition/fingerprint
10. `fraud_history`: Number of prior flagged transactions associated with the account
11. `is_fraud`: Target ground-truth label (`1` = Fraudulent, `0` = Legitimate)

---

## 🚀 How to Run the Pipeline

### Step 1: Generate / Regenerate the Dataset
```bash
python generate_dataset.py
```
*Outputs `transactions_dataset.csv` with 10,000 balanced records.*

### Step 2: Train and Evaluate the Model
```bash
python train_model.py
```

---

## 📈 Evaluation Results

- **Accuracy**: `99.9%`
- **Precision**: `100.0%`
- **Recall**: `98.3%`
- **F1-Score**: `99.1%`
- **Confusion Matrix**: `TP=116, FP=0, TN=1882, FN=2`

---

## 🔗 Bridge to the Backend (`fraudScoringService.js`)

The relative weights derived from this Python model directly correspond to the production weights used in ClearPay's Node.js backend:

| Feature | ML Model Weight | Production Scoring Role |
| :--- | :--- | :--- |
| **Amount Ratio** | ~`29.2%` | Flags spikes $> 2.5\times$ user's typical transfer amount |
| **Velocity Score** | ~`27.8%` | Flags rapid succession draining attacks ($> 3$ transactions/hr) |
| **Fraud History** | ~`18.4%` | Penalizes accounts with prior infractions |
| **Time Anomaly** | ~`9.2%` | Scrutinizes midnight / early-morning transfers |
| **New Beneficiary** | ~`8.5%` | Scrutinizes first-time recipient transfers |
| **Device Risk** | ~`6.9%` | Flags unfamiliar or spoofed browser fingerprints |
