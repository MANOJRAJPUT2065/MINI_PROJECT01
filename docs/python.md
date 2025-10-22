# Python AI/ML Service Documentation

## 🤖 Overview

The Python service provides AI-powered fraud detection for insurance claims using machine learning models. It analyzes claim data in real-time to identify potentially fraudulent activities and provides risk scores.

## 🚀 Quick Start

- **Start Command**: `python app.py`
- **Port**: 5001
- **Base URL**: `http://localhost:5001`
- **Main Endpoint**: `POST /predict`

## 🔧 Environment Setup

### Prerequisites
```bash
# Python 3.8+ required
python --version

# Install dependencies
pip install -r requirements.txt
```

### Required Dependencies
```txt
Flask==2.3.3
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
joblib==1.3.2
```

## 🧠 Machine Learning Pipeline

### Model Architecture
The fraud detection system uses a supervised learning approach with the following components:

1. **Data Preprocessing**: Feature engineering and data cleaning
2. **Feature Encoding**: Categorical variable encoding using LabelEncoders
3. **Model Training**: Ensemble methods for robust predictions
4. **Prediction Serving**: Real-time fraud detection via REST API

### Feature Engineering
The model analyzes the following features:

| Feature | Type | Description | Importance |
|---------|------|-------------|------------|
| **DiagnosisCode** | Categorical | Medical diagnosis code | High |
| **TreatmentCode** | Categorical | Treatment procedure code | High |
| **ClaimAmount** | Numerical | Amount claimed | High |
| **ExpectedAmount** | Numerical | Expected claim amount | Medium |
| **IsDuplicate** | Categorical | Whether claim is duplicate | High |
| **ClaimFrequencyPatient** | Numerical | Patient's claim frequency | Medium |
| **ClaimFrequencyDoctor** | Numerical | Doctor's claim frequency | Medium |
| **DoctorName** | Categorical | Doctor's name | Low |
| **PatientName** | Categorical | Patient's name | Low |
| **WalletAddress** | Categorical | Blockchain wallet address | Medium |

### Model Training Process
```python
# Example training pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix

def train_fraud_detection_model(data):
    # Load and preprocess data
    df = pd.read_csv('datasets/Fraud_Detection_Dataset.csv')
    
    # Feature engineering
    features = ['DiagnosisCode', 'TreatmentCode', 'ClaimAmount', 
                'ExpectedAmount', 'IsDuplicate', 'ClaimFrequencyPatient',
                'ClaimFrequencyDoctor']
    
    X = df[features]
    y = df['IsFraud']
    
    # Encode categorical variables
    encoders = {}
    for col in ['DiagnosisCode', 'TreatmentCode', 'IsDuplicate']:
        encoder = LabelEncoder()
        X[col] = encoder.fit_transform(X[col])
        encoders[f'{col}_encoder'] = encoder
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    
    # Save model and encoders
    joblib.dump(model, 'model/fraud_detection_model.pkl')
    for name, encoder in encoders.items():
        joblib.dump(encoder, f'model/encoders/{name}.pkl')
    
    return model, encoders
```

## 🔍 Fraud Detection Algorithm

### Risk Assessment Logic
The system uses a multi-layered approach to detect fraud:

1. **Statistical Analysis**: Anomaly detection based on historical patterns
2. **Pattern Recognition**: Machine learning models identify suspicious patterns
3. **Rule-based Filtering**: Business rules for obvious fraud indicators
4. **Ensemble Scoring**: Multiple models combined for robust predictions

### Fraud Indicators
- **Unusual Claim Amounts**: Claims significantly higher than expected
- **Duplicate Claims**: Multiple similar claims from same patient/doctor
- **High Frequency**: Unusually high claim frequency patterns
- **Suspicious Patterns**: Unusual combinations of diagnosis and treatment codes
- **Blockchain Anomalies**: Suspicious wallet address patterns

### Risk Scoring
```python
def calculate_risk_score(features):
    """
    Calculate comprehensive risk score for a claim
    
    Returns:
        dict: Risk assessment with score and explanation
    """
    risk_factors = []
    risk_score = 0
    
    # Amount-based risk
    if features['ClaimAmount'] > features['ExpectedAmount'] * 1.5:
        risk_factors.append("Claim amount significantly exceeds expected")
        risk_score += 30
    
    # Frequency-based risk
    if features['ClaimFrequencyPatient'] > 10:
        risk_factors.append("High patient claim frequency")
        risk_score += 20
    
    if features['ClaimFrequencyDoctor'] > 50:
        risk_factors.append("High doctor claim frequency")
        risk_score += 25
    
    # Duplicate risk
    if features['IsDuplicate'] == 'Yes':
        risk_factors.append("Potential duplicate claim")
        risk_score += 40
    
    # Determine risk level
    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
    
    return {
        'risk_score': min(risk_score, 100),
        'risk_level': risk_level,
        'risk_factors': risk_factors,
        'recommendation': get_recommendation(risk_level)
    }

def get_recommendation(risk_level):
    """Get recommendation based on risk level"""
    recommendations = {
        'HIGH': 'Immediate manual review required',
        'MEDIUM': 'Additional verification recommended',
        'LOW': 'Standard processing acceptable'
    }
    return recommendations.get(risk_level, 'Review required')
```

## 📊 API Documentation

### Prediction Endpoint
**POST** `/predict`

#### Request Body
```json
{
  "doctorName": "Dr. John Smith",
  "doctorId": 12345,
  "patientName": "Jane Doe",
  "patientId": 67890,
  "DiagnosisCode": "I10",
  "TreatmentCode": "99213",
  "ClaimAmount": 500.00,
  "ExpectedAmount": 450.00,
  "IsDuplicate": "No",
  "ClaimFrequencyPatient": 3,
  "ClaimFrequencyDoctor": 25,
  "walletAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "description": "Hypertension consultation"
}
```

#### Response
```json
{
  "fraud": false,
  "risk_score": 25,
  "risk_level": "LOW",
  "confidence": 0.85,
  "risk_factors": [],
  "recommendation": "Standard processing acceptable",
  "processing_time_ms": 45
}
```

### Health Check Endpoint
**GET** `/health`

#### Response
```json
{
  "status": "healthy",
  "model_loaded": true,
  "encoders_loaded": true,
  "uptime_seconds": 3600,
  "version": "1.0.0"
}
```

## 🔧 Configuration

### Model Configuration
```python
# config/model_config.py
MODEL_CONFIG = {
    'model_path': 'model/fraud_detection_model.pkl',
    'encoders_dir': 'model/encoders/',
    'threshold': 0.5,  # Fraud detection threshold
    'max_features': 13,  # Number of input features
    'confidence_threshold': 0.7  # Minimum confidence for predictions
}

# Feature configuration
FEATURE_CONFIG = {
    'categorical_features': [
        'DiagnosisCode', 'TreatmentCode', 'IsDuplicate',
        'DoctorName', 'PatientName', 'WalletAddress', 'Description'
    ],
    'numerical_features': [
        'ClaimAmount', 'ExpectedAmount', 'ClaimFrequencyPatient',
        'ClaimFrequencyDoctor', 'DoctorId', 'PatientId'
    ]
}
```

### Logging Configuration
```python
# config/logging_config.py
import logging
import sys

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        },
        'detailed': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'INFO',
            'formatter': 'standard',
            'stream': sys.stdout
        },
        'file': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'detailed',
            'filename': 'logs/fraud_detection.log'
        }
    },
    'loggers': {
        'fraud_detection': {
            'level': 'DEBUG',
            'handlers': ['console', 'file'],
            'propagate': False
        }
    }
}
```

## 🧪 Testing

### Unit Tests
```python
# tests/test_fraud_detection.py
import unittest
import json
from app import app

class TestFraudDetection(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_predict_endpoint(self):
        """Test the prediction endpoint with valid data"""
        data = {
            "doctorName": "Dr. Test",
            "doctorId": 1,
            "patientName": "Test Patient",
            "patientId": 1,
            "DiagnosisCode": "I10",
            "TreatmentCode": "99213",
            "ClaimAmount": 100.0,
            "ExpectedAmount": 100.0,
            "IsDuplicate": "No",
            "ClaimFrequencyPatient": 1,
            "ClaimFrequencyDoctor": 1,
            "walletAddress": "0x123",
            "description": "Test consultation"
        }
        
        response = self.app.post('/predict', 
                               data=json.dumps(data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertIn('fraud', result)
        self.assertIn('risk_score', result)
    
    def test_invalid_data(self):
        """Test prediction with invalid data"""
        data = {"invalid": "data"}
        
        response = self.app.post('/predict',
                               data=json.dumps(data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        
        result = json.loads(response.data)
        self.assertEqual(result['status'], 'healthy')

if __name__ == '__main__':
    unittest.main()
```

### Performance Testing
```python
# tests/test_performance.py
import time
import concurrent.futures
import requests

def test_prediction_performance():
    """Test API performance under load"""
    url = 'http://localhost:5001/predict'
    data = {
        "doctorName": "Dr. Test",
        "doctorId": 1,
        "patientName": "Test Patient",
        "patientId": 1,
        "DiagnosisCode": "I10",
        "TreatmentCode": "99213",
        "ClaimAmount": 100.0,
        "ExpectedAmount": 100.0,
        "IsDuplicate": "No",
        "ClaimFrequencyPatient": 1,
        "ClaimFrequencyDoctor": 1,
        "walletAddress": "0x123",
        "description": "Test consultation"
    }
    
    def make_request():
        start_time = time.time()
        response = requests.post(url, json=data)
        end_time = time.time()
        return {
            'status_code': response.status_code,
            'response_time': end_time - start_time
        }
    
    # Test with 100 concurrent requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(100)]
        results = [future.result() for future in futures]
    
    # Analyze results
    successful_requests = [r for r in results if r['status_code'] == 200]
    avg_response_time = sum(r['response_time'] for r in successful_requests) / len(successful_requests)
    
    print(f"Successful requests: {len(successful_requests)}/100")
    print(f"Average response time: {avg_response_time:.3f}s")
    
    assert len(successful_requests) >= 95  # 95% success rate
    assert avg_response_time < 1.0  # Under 1 second average
```

## 📈 Model Monitoring

### Performance Metrics
```python
# monitoring/model_monitor.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class ModelMonitor:
    def __init__(self):
        self.predictions_log = []
        self.performance_metrics = {}
    
    def log_prediction(self, input_data, prediction, response_time):
        """Log prediction for monitoring"""
        log_entry = {
            'timestamp': datetime.now(),
            'input_data': input_data,
            'prediction': prediction,
            'response_time': response_time
        }
        self.predictions_log.append(log_entry)
    
    def calculate_metrics(self, hours=24):
        """Calculate performance metrics for the last N hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        recent_predictions = [
            p for p in self.predictions_log 
            if p['timestamp'] > cutoff_time
        ]
        
        if not recent_predictions:
            return {}
        
        response_times = [p['response_time'] for p in recent_predictions]
        fraud_predictions = [p['prediction']['fraud'] for p in recent_predictions]
        
        metrics = {
            'total_predictions': len(recent_predictions),
            'avg_response_time': np.mean(response_times),
            'max_response_time': np.max(response_times),
            'min_response_time': np.min(response_times),
            'fraud_rate': np.mean(fraud_predictions),
            'throughput_per_hour': len(recent_predictions) / hours
        }
        
        return metrics
    
    def detect_drift(self):
        """Detect model performance drift"""
        # Implementation for detecting model drift
        # This would compare current performance with historical baselines
        pass
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Run application
CMD ["python", "app.py"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  fraud-detection:
    build: .
    ports:
      - "5001:5001"
    environment:
      - FLASK_ENV=production
      - PYTHONUNBUFFERED=1
    volumes:
      - ./model:/app/model
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Production Deployment
```bash
# Build and run with Docker
docker build -t fraud-detection-api .
docker run -p 5001:5001 fraud-detection-api

# Or with Docker Compose
docker-compose up -d

# Scale the service
docker-compose up -d --scale fraud-detection=3
```

## 🔒 Security Considerations

### Input Validation
- **Data Sanitization**: All input data is validated and sanitized
- **Type Checking**: Strict type validation for all parameters
- **Range Validation**: Numerical values are checked for reasonable ranges

### API Security
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Authentication**: API key authentication for production use
- **HTTPS**: All communications encrypted in production

### Model Security
- **Model Integrity**: Model files are checksummed and validated
- **Secure Storage**: Model files stored securely with proper permissions
- **Audit Logging**: All predictions and model access logged

## 📚 Additional Resources

### Model Training Scripts
- `train_model.py`: Main training script
- `feature_engineering.py`: Feature preprocessing utilities
- `model_evaluation.py`: Model performance evaluation

### Data Processing
- `data_preprocessing.py`: Data cleaning and preparation
- `feature_selection.py`: Feature importance analysis
- `data_validation.py`: Data quality checks

### Monitoring & Alerting
- `model_monitor.py`: Real-time model monitoring
- `alert_system.py`: Automated alerting for anomalies
- `performance_tracker.py`: Performance metrics tracking
