"""
Dataset Generator for Banking Fraud Detection
Simulates realistic transactions modeled after the PaySim / Kaggle Banking Fraud benchmarks.
Features directly correspond to Backend/services/fraudScoringService.js.
"""

import csv
import random
import math

def generate_banking_dataset(filename="transactions_dataset.csv", num_records=10000, fraud_ratio=0.06):
    random.seed(42)
    
    headers = [
        "transaction_id",
        "user_id",
        "amount",
        "avg_user_amount",
        "amount_ratio",
        "new_beneficiary",
        "velocity_score",
        "time_anomaly",
        "device_trust_score",
        "fraud_history",
        "is_fraud"
    ]
    
    records = []
    num_fraud = int(num_records * fraud_ratio)
    num_legit = num_records - num_fraud
    
    print(f"Generating {num_records} transaction records ({num_legit} legitimate, {num_fraud} fraudulent)...")
    
    # 1. Generate Legitimate Transactions
    for i in range(1, num_legit + 1):
        txn_id = f"TXN_{100000 + i}"
        user_id = f"USR_{random.randint(1001, 1500)}"
        
        avg_amount = round(random.uniform(50.0, 500.0), 2)
        # Normal amounts fluctuate near average
        amount_ratio = round(random.gauss(1.0, 0.35), 2)
        amount_ratio = max(0.1, min(amount_ratio, 2.2))
        amount = round(avg_amount * amount_ratio, 2)
        
        # Most transfers are to known beneficiaries
        new_beneficiary = 1 if random.random() < 0.15 else 0
        
        # Low velocity for regular users
        velocity_score = random.choices([0, 1, 2, 3], weights=[0.60, 0.25, 0.12, 0.03])[0]
        
        # Rarely at unusual midnight hours
        time_anomaly = 1 if random.random() < 0.08 else 0
        
        # High device trust for typical devices
        device_trust_score = round(random.uniform(0.75, 0.98), 2)
        
        # Clean history
        fraud_history = 0
        
        records.append([
            txn_id, user_id, amount, avg_amount, amount_ratio,
            new_beneficiary, velocity_score, time_anomaly,
            device_trust_score, fraud_history, 0
        ])
        
    # 2. Generate Fraudulent Transactions
    for i in range(1, num_fraud + 1):
        txn_id = f"TXN_{200000 + i}"
        user_id = f"USR_{random.randint(1001, 1500)}"
        
        avg_amount = round(random.uniform(50.0, 500.0), 2)
        # Fraudulent transactions often feature high-amount spikes
        amount_ratio = round(random.uniform(2.5, 9.0), 2)
        amount = round(avg_amount * amount_ratio, 2)
        
        # Fraudsters frequently transfer to new/compromised mule accounts
        new_beneficiary = 1 if random.random() < 0.85 else 0
        
        # High transaction velocity (rapid drain attempts)
        velocity_score = random.choices([2, 3, 4, 5, 6], weights=[0.10, 0.25, 0.35, 0.20, 0.10])[0]
        
        # Frequently late at night when victims are asleep
        time_anomaly = 1 if random.random() < 0.55 else 0
        
        # New or spoofed device
        device_trust_score = round(random.uniform(0.15, 0.45), 2)
        
        # Some accounts have prior suspicious activity
        fraud_history = random.choices([0, 1, 2], weights=[0.70, 0.20, 0.10])[0]
        
        records.append([
            txn_id, user_id, amount, avg_amount, amount_ratio,
            new_beneficiary, velocity_score, time_anomaly,
            device_trust_score, fraud_history, 1
        ])
        
    # Shuffle dataset
    random.shuffle(records)
    
    # Write to CSV
    with open(filename, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)
        
    print(f"Successfully created dataset '{filename}' with {len(records)} records.")

if __name__ == "__main__":
    generate_banking_dataset("transactions_dataset.csv", num_records=10000, fraud_ratio=0.06)
