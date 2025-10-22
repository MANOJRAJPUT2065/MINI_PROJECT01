# Tutorials & Usage Examples

## 🎯 Getting Started Tutorials

### 1. Complete System Setup

This tutorial will guide you through setting up the entire healthcare system from scratch.

#### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

#### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-org/healthcare-system.git
cd healthcare-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install Python dependencies
cd ../python
pip install -r requirements.txt

# Install smart contract dependencies
cd ../smartcontracts
npm install
```

#### Step 2: Environment Configuration
```bash
# Copy environment template
cp docs/env.example backend/.env
cp docs/env.example frontend/.env

# Edit backend/.env with your values
nano backend/.env
```

#### Step 3: Database Setup
```bash
# Start MongoDB (if using local instance)
mongod

# Or configure MongoDB Atlas connection string in .env
```

#### Step 4: Start Services
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start

# Terminal 3: Start Python AI service
cd python
python app.py

# Terminal 4: Start blockchain node (optional)
cd smartcontracts
npx hardhat node
```

### 2. User Registration and Authentication

#### Patient Registration
```javascript
// Frontend: Patient registration form
const registerPatient = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        role: 'patient',
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Registration successful:', result.data);
      // Redirect to login or dashboard
    } else {
      console.error('Registration failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

#### Doctor Registration
```javascript
// Backend: Doctor registration with blockchain verification
const registerDoctor = async (doctorData) => {
  try {
    // 1. Create user account
    const user = await User.create({
      ...doctorData,
      role: 'doctor',
      isVerified: false // Requires manual verification
    });

    // 2. Register on blockchain
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    await contract.methods.registerDoctor(
      doctorData.walletAddress,
      doctorData.name,
      doctorData.licenseNumber,
      doctorData.specialization,
      doctorData.certificationHash
    ).send({
      from: adminWallet,
      gas: 200000
    });

    // 3. Send verification email
    await sendVerificationEmail(user.email, user.id);

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Doctor registration failed:', error);
    throw error;
  }
};
```

### 3. Claim Submission Workflow

#### Patient Submits Claim
```javascript
// Frontend: Claim submission form
const submitClaim = async (claimData) => {
  try {
    // 1. Upload supporting documents
    const documentUrls = await uploadDocuments(claimData.documents);
    
    // 2. Submit claim to backend
    const response = await fetch('/api/_claims/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        claimType: 'medical',
        policyNumber: 'POL123456789',
        incidentDate: '2023-07-10',
        description: 'Emergency room visit for chest pain',
        amount: 2500.00,
        currency: 'USD',
        hospitalName: 'City General Hospital',
        doctorName: 'Dr. Smith',
        diagnosis: 'Chest pain evaluation',
        treatment: 'ECG, blood tests, consultation',
        attachments: documentUrls,
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1234567890'
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // 3. Submit to blockchain for verification
      await submitToBlockchain(result.data.claimId, claimData);
      
      // 4. Show success message and redirect
      showSuccessMessage('Claim submitted successfully!');
      navigateToClaimTracking(result.data.claimId);
    }
  } catch (error) {
    console.error('Claim submission failed:', error);
    showErrorMessage('Failed to submit claim. Please try again.');
  }
};
```

#### Blockchain Integration
```javascript
// Backend: Submit claim to blockchain
const submitToBlockchain = async (claimId, claimData) => {
  try {
    const web3 = new Web3(process.env.INFURA_URL);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Get patient's wallet address
    const patient = await User.findById(claimData.patientId);
    
    // Submit claim to smart contract
    const result = await contract.methods.submitClaim(
      claimData.doctorAddress,
      web3.utils.toWei(claimData.amount.toString(), 'ether'),
      claimData.diagnosis,
      claimData.treatment,
      claimData.ipfsHash
    ).send({
      from: patient.walletAddress,
      gas: 200000
    });

    // Update claim with blockchain transaction hash
    await Claim.findByIdAndUpdate(claimId, {
      blockchainTxHash: result.transactionHash,
      blockchainStatus: 'submitted'
    });

    return result;
  } catch (error) {
    console.error('Blockchain submission failed:', error);
    throw error;
  }
};
```

### 4. AI Fraud Detection Integration

#### Fraud Detection Service
```python
# Python: Fraud detection API
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model and encoders
model = joblib.load('model/fraud_detection_model.pkl')
diagnosis_encoder = joblib.load('model/encoders/DiagnosisCode_encoder.pkl')
treatment_encoder = joblib.load('model/encoders/TreatmentCode_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict_fraud():
    try:
        data = request.get_json()
        
        # Extract features
        features = np.array([[
            diagnosis_encoder.transform([data['DiagnosisCode']])[0],
            treatment_encoder.transform([data['TreatmentCode']])[0],
            data['ClaimAmount'],
            data['ExpectedAmount'],
            data['ClaimFrequencyPatient'],
            data['ClaimFrequencyDoctor']
        ]])
        
        # Get prediction
        prediction = model.predict(features)
        fraud_probability = model.predict_proba(features)[0][1]
        
        # Calculate risk score
        risk_score = calculate_risk_score(data, fraud_probability)
        
        return jsonify({
            'fraud': bool(prediction[0]),
            'fraud_probability': float(fraud_probability),
            'risk_score': risk_score,
            'risk_level': get_risk_level(risk_score),
            'recommendation': get_recommendation(risk_score)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_risk_score(data, fraud_probability):
    """Calculate comprehensive risk score"""
    risk_factors = []
    risk_score = 0
    
    # Amount-based risk
    if data['ClaimAmount'] > data['ExpectedAmount'] * 1.5:
        risk_score += 30
        risk_factors.append("Claim amount significantly exceeds expected")
    
    # Frequency-based risk
    if data['ClaimFrequencyPatient'] > 10:
        risk_score += 20
        risk_factors.append("High patient claim frequency")
    
    # AI model risk
    risk_score += int(fraud_probability * 50)
    
    return min(risk_score, 100)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

#### Backend Integration
```javascript
// Backend: Integrate fraud detection
const checkFraudRisk = async (claimData) => {
  try {
    const response = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        DiagnosisCode: claimData.diagnosis,
        TreatmentCode: claimData.treatment,
        ClaimAmount: claimData.amount,
        ExpectedAmount: claimData.expectedAmount,
        ClaimFrequencyPatient: claimData.patientClaimCount,
        ClaimFrequencyDoctor: claimData.doctorClaimCount
      })
    });

    const fraudResult = await response.json();
    
    // Update claim with fraud detection results
    await Claim.findByIdAndUpdate(claimData.claimId, {
      fraudDetected: fraudResult.fraud,
      fraudScore: fraudResult.risk_score,
      fraudProbability: fraudResult.fraud_probability,
      riskLevel: fraudResult.risk_level
    });

    return fraudResult;
  } catch (error) {
    console.error('Fraud detection failed:', error);
    // Continue processing even if fraud detection fails
    return { fraud: false, risk_score: 0 };
  }
};
```

### 5. Real-time Claim Tracking

#### WebSocket Implementation
```javascript
// Backend: WebSocket for real-time updates
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  // Join claim tracking room
  socket.on('join-claim-room', (claimId) => {
    socket.join(`claim-${claimId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Emit claim status updates
const emitClaimUpdate = (claimId, status, details) => {
  io.to(`claim-${claimId}`).emit('claim-update', {
    claimId,
    status,
    details,
    timestamp: new Date().toISOString()
  });
};
```

#### Frontend Real-time Updates
```javascript
// Frontend: Real-time claim tracking
import io from 'socket.io-client';

class ClaimTracker {
  constructor(claimId) {
    this.claimId = claimId;
    this.socket = io(process.env.REACT_APP_API_URL);
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Join claim tracking room
    this.socket.emit('join-claim-room', this.claimId);
    
    // Listen for status updates
    this.socket.on('claim-update', (data) => {
      this.updateClaimStatus(data);
    });
    
    // Listen for connection status
    this.socket.on('connect', () => {
      console.log('Connected to real-time updates');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from real-time updates');
    });
  }
  
  updateClaimStatus(data) {
    const { claimId, status, details, timestamp } = data;
    
    // Update UI with new status
    this.updateStatusIndicator(status);
    this.addStatusUpdate(details, timestamp);
    
    // Show notification if status changed
    if (status !== this.lastStatus) {
      this.showStatusNotification(status);
      this.lastStatus = status;
    }
  }
  
  updateStatusIndicator(status) {
    const statusElement = document.getElementById('claim-status');
    statusElement.textContent = status;
    statusElement.className = `status-${status.toLowerCase()}`;
  }
  
  addStatusUpdate(details, timestamp) {
    const updatesList = document.getElementById('status-updates');
    const updateElement = document.createElement('div');
    updateElement.className = 'status-update';
    updateElement.innerHTML = `
      <div class="update-details">${details}</div>
      <div class="update-time">${new Date(timestamp).toLocaleString()}</div>
    `;
    updatesList.insertBefore(updateElement, updatesList.firstChild);
  }
}
```

### 6. Admin Dashboard Analytics

#### Analytics Data Collection
```javascript
// Backend: Analytics data aggregation
const getAnalyticsData = async (timeRange = '30d') => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));
    
    // Aggregate claims data
    const claimsData = await Claim.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Fraud detection statistics
    const fraudStats = await Claim.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalClaims: { $sum: 1 },
          fraudDetected: { $sum: { $cond: ['$fraudDetected', 1, 0] } },
          avgFraudScore: { $avg: '$fraudScore' },
          highRiskClaims: { $sum: { $cond: [{ $gte: ['$fraudScore', 70] }, 1, 0] } }
        }
      }
    ]);
    
    // Processing time statistics
    const processingStats = await Claim.aggregate([
      {
        $match: {
          status: { $in: ['approved', 'rejected'] },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $project: {
          processingTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgProcessingTime: { $avg: '$processingTime' },
          minProcessingTime: { $min: '$processingTime' },
          maxProcessingTime: { $max: '$processingTime' }
        }
      }
    ]);
    
    return {
      claimsData,
      fraudStats: fraudStats[0] || {},
      processingStats: processingStats[0] || {},
      timeRange
    };
  } catch (error) {
    console.error('Analytics data collection failed:', error);
    throw error;
  }
};
```

#### Frontend Analytics Dashboard
```javascript
// Frontend: Analytics dashboard component
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimsChartData = {
    labels: analyticsData?.claimsData.map(item => item._id.date) || [],
    datasets: [
      {
        label: 'Claims Submitted',
        data: analyticsData?.claimsData.map(item => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const fraudChartData = {
    labels: ['Legitimate', 'Fraudulent'],
    datasets: [{
      data: [
        analyticsData?.fraudStats.totalClaims - analyticsData?.fraudStats.fraudDetected || 0,
        analyticsData?.fraudStats.fraudDetected || 0
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ]
    }]
  };

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      
      <div className="time-range-selector">
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Claims Over Time</h3>
          <Line data={claimsChartData} options={{ responsive: true }} />
        </div>

        <div className="chart-container">
          <h3>Fraud Detection</h3>
          <Pie data={fraudChartData} options={{ responsive: true }} />
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <h4>Total Claims</h4>
            <p>{analyticsData?.fraudStats.totalClaims || 0}</p>
          </div>
          <div className="stat-card">
            <h4>Fraud Rate</h4>
            <p>{((analyticsData?.fraudStats.fraudDetected / analyticsData?.fraudStats.totalClaims) * 100 || 0).toFixed(2)}%</p>
          </div>
          <div className="stat-card">
            <h4>Avg Processing Time</h4>
            <p>{analyticsData?.processingStats.avgProcessingTime?.toFixed(1) || 0} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### 7. Mobile App Integration

#### React Native Setup
```javascript
// React Native: Mobile app configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Web3 } from 'web3';

class HealthcareMobileApp {
  constructor() {
    this.apiBaseUrl = 'https://api.healthcaresystem.com';
    this.web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
  }

  // Authentication
  async login(email, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Submit claim with camera integration
  async submitClaimWithCamera(claimData, imageUris) {
    try {
      // Upload images
      const uploadedImages = await Promise.all(
        imageUris.map(uri => this.uploadImage(uri))
      );

      // Submit claim
      const response = await fetch(`${this.apiBaseUrl}/api/_claims/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...claimData,
          attachments: uploadedImages
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Claim submission failed:', error);
      throw error;
    }
  }

  // Upload image from camera
  async uploadImage(imageUri) {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'claim_document.jpg'
    });

    const response = await fetch(`${this.apiBaseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
      },
      body: formData
    });

    const data = await response.json();
    return data.data.fileId;
  }

  // Real-time claim tracking
  setupClaimTracking(claimId) {
    // Implement WebSocket connection for real-time updates
    const socket = io(this.apiBaseUrl);
    
    socket.emit('join-claim-room', claimId);
    
    socket.on('claim-update', (data) => {
      // Update UI with new claim status
      this.updateClaimStatus(data);
    });

    return socket;
  }
}
```

### 8. API Testing with Postman

#### Postman Collection Setup
```json
{
  "info": {
    "name": "Healthcare System API",
    "description": "Complete API collection for healthcare system",
    "version": "1.0.0"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register Patient",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"securePassword123\",\n  \"role\": \"patient\",\n  \"phoneNumber\": \"+1234567890\",\n  \"dateOfBirth\": \"1990-01-01\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"securePassword123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    if (response.success) {",
                  "        pm.collectionVariables.set('token', response.data.token);",
                  "    }",
                  "}"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Claims",
      "item": [
        {
          "name": "Submit Claim",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"claimType\": \"medical\",\n  \"policyNumber\": \"POL123456789\",\n  \"incidentDate\": \"2023-07-10\",\n  \"description\": \"Emergency room visit\",\n  \"amount\": 2500.00,\n  \"hospitalName\": \"City General Hospital\",\n  \"doctorName\": \"Dr. Smith\",\n  \"diagnosis\": \"Chest pain evaluation\",\n  \"treatment\": \"ECG, blood tests, consultation\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/_claims/submit",
              "host": ["{{baseUrl}}"],
              "path": ["_claims", "submit"]
            }
          }
        },
        {
          "name": "Get Claim History",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/claim-history/history",
              "host": ["{{baseUrl}}"],
              "path": ["claim-history", "history"]
            }
          }
        }
      ]
    }
  ]
}
```

### 9. Deployment Tutorials

#### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S healthcare -u 1001
USER healthcare

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/healthcare-system
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  python-ai:
    build: ./python
    ports:
      - "5001:5001"
    volumes:
      - ./python/model:/app/model
    restart: unless-stopped

volumes:
  mongo_data:
```

### 10. Performance Optimization

#### Database Optimization
```javascript
// Backend: Database indexing and query optimization
const optimizeDatabase = async () => {
  try {
    // Create indexes for frequently queried fields
    await Claim.createIndex({ patient: 1, status: 1 });
    await Claim.createIndex({ createdAt: -1 });
    await Claim.createIndex({ amount: 1 });
    await Claim.createIndex({ fraudScore: -1 });
    
    // Create text index for search
    await Claim.createIndex({ 
      description: 'text', 
      diagnosis: 'text', 
      treatment: 'text' 
    });
    
    // Create compound indexes
    await Claim.createIndex({ 
      patient: 1, 
      status: 1, 
      createdAt: -1 
    });
    
    console.log('Database optimization completed');
  } catch (error) {
    console.error('Database optimization failed:', error);
  }
};
```

#### Caching Implementation
```javascript
// Backend: Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        client.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};
```

## 🎓 Advanced Tutorials

### 1. Custom AI Model Training
### 2. Blockchain Smart Contract Development
### 3. Microservices Architecture
### 4. CI/CD Pipeline Setup
### 5. Security Penetration Testing
### 6. Load Testing and Performance Tuning
### 7. Multi-tenant Architecture
### 8. Internationalization (i18n)
### 9. Advanced Analytics and Machine Learning
### 10. Disaster Recovery and Backup Strategies

## 📚 Additional Resources

- **Video Tutorials**: [YouTube Channel](https://youtube.com/healthcaresystem)
- **Interactive Demos**: [Live Demo](https://demo.healthcaresystem.com)
- **Community Forum**: [Discord Server](https://discord.gg/healthcaresystem)
- **Documentation**: [Full Documentation](https://docs.healthcaresystem.com)
- **API Reference**: [API Docs](https://api.healthcaresystem.com/docs)