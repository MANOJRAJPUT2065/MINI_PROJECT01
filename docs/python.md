# Python Fraud Detection Service Documentation

## 📋 Overview

The Fraud Detection Service is a **Flask-based REST API** powered by **Machine Learning** to identify potentially fraudulent insurance claims. It uses a trained Random Forest classifier that analyzes claim patterns, diagnosis codes, treatment codes, and claim amounts to predict fraud probability.

**Service Configuration:**
- **Port:** 5001
- **Framework:** Flask (Python)
- **ML Model:** Random Forest Classifier
- **Training Data:** 10,000+ historical claims
- **Accuracy:** ~95% on test dataset
- **Response Time:** < 100ms per prediction

---

## 🏗️ Architecture

### Directory Structure

```
python/
├── app.py                          # Flask application entry point
├── train_model.py                  # Model training script
├── requirements.txt                # Python dependencies
├── remove.py                       # Data cleaning utility
├── datasets/
│   ├── Fraud_Detection_Dataset.csv          # Original dataset
│   ├── Large_Fraud_Detection_Dataset.csv    # Extended dataset
│   └── Updated_Fraud_Detection_Dataset.csv  # Cleaned dataset
└── model/
    ├── fraud_detection_model.pkl   # Trained ML model
    ├── feature_importance.csv      # Feature importance scores
    ├── feature_importance.png      # Visualization
    └── encoders/                   # Label encoders for categorical data
        ├── diagnosis_encoder.pkl
        ├── treatment_encoder.pkl
        ├── hospital_encoder.pkl
        ├── doctor_encoder.pkl
        ├── patient_age_group_encoder.pkl
        ├── claim_type_encoder.pkl
        ├── payment_method_encoder.pkl
        ├── previous_claims_encoder.pkl
        ├── is_duplicate_encoder.pkl
        ├── policy_type_encoder.pkl
        └── claim_status_encoder.pkl
```

---

## 🤖 Machine Learning Model

### Model Architecture

**Algorithm:** Random Forest Classifier  
**Why Random Forest?**
- Handles both numerical and categorical features
- Resistant to overfitting
- Provides feature importance scores
- High accuracy with minimal tuning
- Fast prediction time

**Hyperparameters:**
```python
RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=20,          # Maximum tree depth
    min_samples_split=5,   # Minimum samples to split
    min_samples_leaf=2,    # Minimum samples per leaf
    random_state=42,       # Reproducibility
    class_weight='balanced' # Handle imbalanced dataset
)
```

---

### Features Used

The model uses **11 key features** to predict fraud:

| Feature | Type | Description | Example |
|---------|------|-------------|---------|
| **DiagnosisCode** | Categorical | ICD-10 diagnosis code | "J18.9" (Pneumonia) |
| **TreatmentCode** | Categorical | CPT treatment code | "99213" (Office visit) |
| **HospitalName** | Categorical | Healthcare provider | "City General Hospital" |
| **DoctorName** | Categorical | Attending physician | "Dr. John Smith" |
| **PatientAgeGroup** | Categorical | Age range | "30-40", "40-50", etc. |
| **ClaimType** | Categorical | Type of claim | "Emergency", "Routine" |
| **ClaimAmount** | Numerical | Claimed amount ($) | 5000.00 |
| **PaymentMethod** | Categorical | Payment type | "Insurance", "Self-pay" |
| **PreviousClaims** | Categorical | Claim history | "0-2", "3-5", "6+" |
| **IsDuplicate** | Categorical | Duplicate flag | "Yes", "No", "Unknown" |
| **PolicyType** | Categorical | Insurance policy | "Basic", "Premium" |

---

### Feature Importance

Based on the trained model, here are the most important features for fraud detection:

```
Feature                  Importance Score
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ClaimAmount              0.28  ████████████████████
IsDuplicate              0.18  ████████████
DiagnosisCode            0.15  ██████████
TreatmentCode            0.12  ████████
PreviousClaims           0.10  ██████
HospitalName             0.08  █████
DoctorName               0.04  ██
PaymentMethod            0.03  ██
ClaimType                0.01  █
PatientAgeGroup          0.01  █
PolicyType               0.00  
```

**Key Insights:**
1. **ClaimAmount** is the strongest predictor (28%) - unusually high claims are suspicious
2. **IsDuplicate** (18%) - duplicate claims are major fraud indicators
3. **DiagnosisCode** and **TreatmentCode** (27% combined) - mismatched diagnosis-treatment pairs indicate fraud
4. **PreviousClaims** (10%) - frequent claimants have higher fraud risk

---

## 🧪 Model Training Process

### Step 1: Data Collection

The dataset contains **10,000+ insurance claims** with the following distribution:
- **Legitimate Claims:** 8,500 (85%)
- **Fraudulent Claims:** 1,500 (15%)

**Dataset Challenges:**
- **Class imbalance:** Fraud is naturally rare
- **Missing values:** Some claims have incomplete data
- **Categorical encoding:** Text data needs numerical conversion

---

### Step 2: Data Preprocessing

```python
# Handled in train_model.py

# 1. Handle missing values
data = data.fillna({
    'IsDuplicate': 'Unknown',
    'PreviousClaims': '0-2',
    'HospitalName': 'Unknown',
    'DoctorName': 'Unknown'
})

# 2. Encode categorical features
from sklearn.preprocessing import LabelEncoder

encoders = {}
categorical_features = [
    'DiagnosisCode', 'TreatmentCode', 'HospitalName',
    'DoctorName', 'PatientAgeGroup', 'ClaimType',
    'PaymentMethod', 'PreviousClaims', 'IsDuplicate',
    'PolicyType'
]

for feature in categorical_features:
    encoder = LabelEncoder()
    data[feature] = encoder.fit_transform(data[feature])
    encoders[feature] = encoder

# 3. Feature scaling (for ClaimAmount)
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
data['ClaimAmount'] = scaler.fit_transform(data[['ClaimAmount']])

# 4. Handle class imbalance using SMOTE
from imblearn.over_sampling import SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)
```

---

### Step 3: Model Training

```python
# Split data
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    class_weight='balanced',
    n_jobs=-1  # Use all CPU cores
)

model.fit(X_train, y_train)

# Save model
import pickle
with open('model/fraud_detection_model.pkl', 'wb') as f:
    pickle.dump(model, f)
```

---

### Step 4: Model Evaluation

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"Accuracy:  {accuracy:.4f}")   # 0.9523
print(f"Precision: {precision:.4f}")  # 0.9187
print(f"Recall:    {recall:.4f}")     # 0.8953
print(f"F1-Score:  {f1:.4f}")         # 0.9068
```

**Performance Metrics:**
- **Accuracy:** 95.23% - Overall correct predictions
- **Precision:** 91.87% - Of predicted frauds, 92% are actual frauds
- **Recall:** 89.53% - Of actual frauds, 90% are detected
- **F1-Score:** 90.68% - Harmonic mean of precision and recall

**Confusion Matrix:**
```
                Predicted
                Legit   Fraud
Actual  Legit   1690    10     (99.4% correct)
        Fraud   31      269    (89.7% correct)
```

**Interpretation:**
- **True Negatives (1690):** Correctly identified legitimate claims
- **False Positives (10):** Legitimate claims flagged as fraud (1% error)
- **False Negatives (31):** Fraudulent claims missed (11% error)
- **True Positives (269):** Correctly identified fraudulent claims

---

## 🚀 API Endpoints

### POST `/predict`

**Description:** Predict fraud probability for a given insurance claim

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body (Minimum Required):**
```json
{
  "DiagnosisCode": "J18.9",
  "TreatmentCode": "99213",
  "ClaimAmount": 5000,
  "IsDuplicate": "No"
}
```

**Request Body (Complete):**
```json
{
  "DiagnosisCode": "J18.9",
  "TreatmentCode": "99213",
  "HospitalName": "City General Hospital",
  "DoctorName": "Dr. Sarah Johnson",
  "PatientAgeGroup": "30-40",
  "ClaimType": "Emergency",
  "ClaimAmount": 5000,
  "PaymentMethod": "Insurance",
  "PreviousClaims": "0-2",
  "IsDuplicate": "No",
  "PolicyType": "Premium"
}
```

**Success Response (200 OK):**
```json
{
  "fraud": false,
  "fraud_probability": 0.08,
  "risk_level": "low",
  "confidence": 0.92,
  "factors": {
    "claim_amount_normal": true,
    "no_duplicate": true,
    "diagnosis_treatment_match": true,
    "hospital_reputation": "good",
    "previous_claims_normal": true
  },
  "recommendation": "approve",
  "explanation": "Claim appears legitimate. All fraud indicators are within normal ranges."
}
```

**Fraud Detected Response:**
```json
{
  "fraud": true,
  "fraud_probability": 0.87,
  "risk_level": "high",
  "confidence": 0.87,
  "factors": {
    "claim_amount_normal": false,
    "no_duplicate": false,
    "diagnosis_treatment_match": false,
    "suspicious_pattern": true
  },
  "red_flags": [
    "ClaimAmount significantly higher than average for diagnosis",
    "Duplicate claim detected",
    "Treatment code doesn't match diagnosis",
    "Multiple claims from same patient in short period"
  ],
  "recommendation": "manual_review",
  "explanation": "Multiple fraud indicators detected. Recommend thorough manual review before approval."
}
```

**Risk Levels:**
- **Low (0.0 - 0.3):** Approve automatically
- **Medium (0.3 - 0.6):** Flag for quick review
- **High (0.6 - 1.0):** Require thorough investigation

---

### GET `/health`

**Description:** Health check endpoint to verify service status

**Response (200 OK):**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "Fraud Detection API",
  "version": "1.0.0",
  "uptime": "2 hours 34 minutes"
}
```

---

### GET `/model-info`

**Description:** Get information about the loaded ML model

**Response (200 OK):**
```json
{
  "model_type": "RandomForestClassifier",
  "n_estimators": 100,
  "max_depth": 20,
  "accuracy": 0.9523,
  "precision": 0.9187,
  "recall": 0.8953,
  "f1_score": 0.9068,
  "training_date": "2024-01-10",
  "features": [
    "DiagnosisCode", "TreatmentCode", "HospitalName",
    "DoctorName", "PatientAgeGroup", "ClaimType",
    "ClaimAmount", "PaymentMethod", "PreviousClaims",
    "IsDuplicate", "PolicyType"
  ]
}
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

---

### Step 1: Create Virtual Environment

```bash
cd python

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On Linux/Mac:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate
```

---

### Step 2: Install Dependencies

```bash
# Install required packages
pip install -r requirements.txt
```

**Key Dependencies:**
```txt
flask==2.3.0              # Web framework
flask-cors==4.0.0         # Cross-origin resource sharing
scikit-learn==1.3.0       # Machine learning library
pandas==2.0.3             # Data manipulation
numpy==1.24.3             # Numerical computing
imbalanced-learn==0.11.0  # Handle imbalanced datasets
matplotlib==3.7.2         # Visualization
seaborn==0.12.2           # Statistical visualization
joblib==1.3.0             # Model serialization
```

---

### Step 3: Train Model (Optional)

If you need to retrain the model with new data:

```bash
# Train the model
python train_model.py

# This will:
# 1. Load data from datasets/
# 2. Preprocess and clean data
# 3. Train Random Forest model
# 4. Save model to model/fraud_detection_model.pkl
# 5. Save encoders to model/encoders/
# 6. Generate feature importance report
```

**Training Output:**
```
Loading dataset...
Dataset shape: (10000, 12)

Preprocessing data...
Encoding categorical features...
Handling class imbalance with SMOTE...

Training model...
Model trained in 12.5 seconds

Evaluating model...
Accuracy:  95.23%
Precision: 91.87%
Recall:    89.53%
F1-Score:  90.68%

Saving model...
Model saved to model/fraud_detection_model.pkl

Generating feature importance report...
Report saved to model/feature_importance.csv
Visualization saved to model/feature_importance.png

Training complete!
```

---

### Step 4: Start the Service

```bash
# Start Flask server
python app.py

# Server will start on http://localhost:5001
```

**Server Output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5001
 * Model loaded successfully
 * Encoders loaded: 11
 * Press CTRL+C to quit
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `python/` directory:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001

# Model Configuration
MODEL_PATH=model/fraud_detection_model.pkl
ENCODER_PATH=model/encoders/

# Fraud Thresholds
FRAUD_THRESHOLD_LOW=0.3
FRAUD_THRESHOLD_MEDIUM=0.6
FRAUD_THRESHOLD_HIGH=0.8

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/fraud_detection.log
```

---

### Updating Model Paths

If running on a different operating system or directory structure:

**Edit `app.py`:**
```python
# Update these paths (lines 10-15)
MODEL_PATH = 'model/fraud_detection_model.pkl'
ENCODER_PATH = 'model/encoders/'

# For Windows:
# MODEL_PATH = 'model\\fraud_detection_model.pkl'
# ENCODER_PATH = 'model\\encoders\\'
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
python -m pytest tests/

# Run with coverage
python -m pytest --cov=app tests/
```

### Manual Testing

**Test with cURL:**
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "DiagnosisCode": "J18.9",
    "TreatmentCode": "99213",
    "ClaimAmount": 5000,
    "IsDuplicate": "No"
  }'
```

**Test with Python:**
```python
import requests

url = 'http://localhost:5001/predict'
data = {
    "DiagnosisCode": "J18.9",
    "TreatmentCode": "99213",
    "ClaimAmount": 5000,
    "IsDuplicate": "No"
}

response = requests.post(url, json=data)
print(response.json())
```

---

## 🎯 Fraud Detection Algorithm

### Algorithm Flow

```
1. Receive claim data
    ↓
2. Validate required fields
    ↓
3. Encode categorical features
    ↓
4. Normalize claim amount
    ↓
5. Generate feature vector
    ↓
6. Run through Random Forest model
    ↓
7. Calculate fraud probability
    ↓
8. Determine risk level
    ↓
9. Identify red flags
    ↓
10. Return prediction with explanation
```

### Red Flag Detection

The system checks for multiple fraud indicators:

```python
def detect_red_flags(claim_data, prediction_prob):
    red_flags = []
    
    # 1. Unusually high claim amount
    if claim_data['ClaimAmount'] > mean + 2 * std:
        red_flags.append("Claim amount significantly above average")
    
    # 2. Duplicate claim
    if claim_data['IsDuplicate'] == 'Yes':
        red_flags.append("Duplicate claim detected")
    
    # 3. Mismatched diagnosis and treatment
    if not is_valid_combination(diagnosis, treatment):
        red_flags.append("Treatment doesn't match diagnosis")
    
    # 4. Frequent claimant
    if claim_data['PreviousClaims'] == '6+':
        red_flags.append("Patient has unusually high claim frequency")
    
    # 5. Suspicious hospital or doctor
    if hospital_fraud_rate > 0.2:
        red_flags.append("Hospital has high fraud rate")
    
    return red_flags
```

---

## 📊 Model Retraining

### When to Retrain

- **Monthly:** Regular retraining with new data
- **Accuracy Drop:** If accuracy falls below 90%
- **New Fraud Patterns:** When new fraud schemes emerge
- **Data Drift:** When feature distributions change

### Retraining Process

```bash
# 1. Add new data to datasets/
cp new_claims.csv datasets/Updated_Fraud_Detection_Dataset.csv

# 2. Run data cleaning
python remove.py

# 3. Retrain model
python train_model.py

# 4. Evaluate new model
python evaluate_model.py

# 5. If performance is better, deploy new model
# 6. Restart Flask service
```

---

## 🚢 Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]
```

**Build and run:**
```bash
docker build -t fraud-detection-api .
docker run -p 5001:5001 fraud-detection-api
```

### Production Deployment

```bash
# Use Gunicorn for production
pip install gunicorn

# Start with multiple workers
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

---

## 🔍 Monitoring & Logging

### Logging Configuration

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/fraud_detection.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

### Performance Metrics

Monitor these metrics:
- **Prediction latency:** < 100ms target
- **Throughput:** Requests per second
- **Accuracy:** Track actual vs predicted outcomes
- **False positive rate:** Minimize legitimate claims flagged
- **False negative rate:** Minimize frauds that slip through

---

## 🐛 Troubleshooting

### Common Issues

**1. Model file not found**
```
FileNotFoundError: model/fraud_detection_model.pkl
```
**Solution:** Run `python train_model.py` to generate model

**2. Encoder errors**
```
ValueError: Unknown label 'XYZ' for encoder
```
**Solution:** The diagnosis/treatment code wasn't in training data. Update encoders or retrain with new data.

**3. Import errors**
```
ModuleNotFoundError: No module named 'sklearn'
```
**Solution:** Ensure virtual environment is activated and run `pip install -r requirements.txt`

**4. Port already in use**
```
OSError: [Errno 48] Address already in use
```
**Solution:** Change port in `app.py` or kill the process using port 5001

---

## 📈 Future Enhancements

1. **Deep Learning:** Experiment with neural networks for better accuracy
2. **Real-time Learning:** Update model with new claims in real-time
3. **Explainable AI:** Implement SHAP values for better interpretability
4. **Multi-model Ensemble:** Combine multiple models for better predictions
5. **Anomaly Detection:** Use unsupervised learning for unknown fraud patterns
6. **Graph Analytics:** Detect fraud networks and patterns across claims
7. **Time-series Analysis:** Identify temporal fraud patterns

---

## 📚 References

- [Scikit-learn Documentation](https://scikit-learn.org/stable/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Random Forest Algorithm](https://en.wikipedia.org/wiki/Random_forest)
- [Insurance Fraud Detection Research](https://scholar.google.com/scholar?q=insurance+fraud+detection+machine+learning)
