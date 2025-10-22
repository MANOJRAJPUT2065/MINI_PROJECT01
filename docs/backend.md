# Backend Documentation (Node.js/Express)

## 📋 Overview

The backend is built using **Node.js** and **Express.js**, providing a robust RESTful API for the healthcare system. It handles authentication, claim processing, blockchain integration, file uploads, and AI-powered fraud detection.

**Default Configuration:**
- **Port:** 5000
- **Start Command:** `npm run dev`
- **Base URL:** `http://localhost:5000`
- **Database:** MongoDB (NoSQL)
- **Architecture Pattern:** MVC (Model-View-Controller)

---

## 🏗️ Architecture

### Directory Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/              # Business logic for each route
│   ├── authController.js     # Authentication & authorization
│   ├── claimsController.js   # Claim submission & processing
│   ├── adminController.js    # Admin dashboard operations
│   └── userController.js     # User profile management
├── middleware/
│   ├── authMiddleware.js     # JWT token verification
│   └── verifyToken.js        # Token validation utilities
├── models/                   # MongoDB schemas (Mongoose)
│   ├── User.js               # User account schema
│   ├── Claim.js              # Insurance claim schema
│   ├── Admin.js              # Admin user schema
│   └── ActivityLog.js        # Audit trail schema
├── routes/                   # API endpoint definitions
│   ├── authRoutes.js         # /api/auth endpoints
│   ├── claimRoutes.js        # /api/claims endpoints
│   └── userRoutes.js         # /api/user endpoints
├── services/
│   ├── blockchain.js         # Smart contract interactions
│   └── predictFraud.js       # ML fraud detection integration
├── nodemailer/
│   └── main.js               # Email service configuration
└── server.js                 # Application entry point
```

### Request Flow

```
Client Request
    ↓
Express Middleware (CORS, Body Parser)
    ↓
Authentication Middleware (JWT verification)
    ↓
Route Handler
    ↓
Controller (Business Logic)
    ↓
Model (Database Operations)
    ↓
External Services (Blockchain, AI, Email)
    ↓
Response to Client
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

### Database Configuration
```env
MONGO_URI=mongodb://localhost:27017/healthcare
# MongoDB connection string. Use MongoDB Atlas for cloud deployment.
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
```

### Authentication
```env
JWT_SECRET=your_super_secret_jwt_key_here
# Secret key for signing JWT tokens. Use a strong, random string.
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Email Service (Nodemailer)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
# For Gmail: Enable 2FA and generate an App Password
# Settings → Security → App Passwords
```

### Cloud Storage (Cloudinary)
```env
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
# Used for storing medical documents, reports, and images
# Sign up at: https://cloudinary.com
```

### IPFS Storage (Pinata)
```env
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key
# Decentralized file storage for sensitive medical records
# Sign up at: https://pinata.cloud
```

### AI Integration (Google Gemini)
```env
GEMINI_API_KEY=your-gemini-api-key
# For AI-powered chatbot and natural language processing
# Get from: https://makersuite.google.com/app/apikey
```

### Frontend URL
```env
CLIENT_URL=http://localhost:3000
# Used for CORS configuration and password reset links
# In production: https://your-frontend-domain.com
```

### Blockchain Configuration
```env
GANACHE_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=0x...
# Ethereum network URL and deployed smart contract address
```

---

## 🛣️ API Routes Documentation

### 1. Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "patient",
  "phone": "+1234567890",
  "walletAddress": "0x..." // Optional for MetaMask users
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### POST `/api/auth/login`
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Alternative (MetaMask):**
```json
{
  "walletAddress": "0x1234567890abcdef...",
  "signature": "0xabcdef..."
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### POST `/api/auth/logout`
**Description:** Invalidate user session

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST `/api/auth/forgot-password`
**Description:** Send password reset link to user email

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### POST `/api/auth/reset-password`
**Description:** Reset password using token from email

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass456!"
}
```

---

### 2. User Management Routes (`/api/user`)

#### GET `/api/user/profile`
**Description:** Retrieve authenticated user's profile

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main St, City, State",
    "insuranceId": "INS-12345",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/user/profile`
**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "phone": "+1987654321",
  "address": "456 New St, City, State"
}
```

---

### 3. Claims Routes (`/api/claims` and `/api/_claims`)

#### POST `/api/_claims/submit`
**Description:** Submit a new insurance claim (includes blockchain verification)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
patientName: John Doe
diagnosisCode: A01.0
treatmentCode: T85.71
claimAmount: 5000
hospitalName: City General Hospital
dateOfService: 2024-01-15
documents: [file1.pdf, file2.pdf]
```

**Process Flow:**
1. File upload to Cloudinary/IPFS
2. Fraud detection check via ML model
3. Blockchain transaction recording
4. Database storage
5. Email notification

**Response:**
```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "claim": {
    "claimId": "CLM-2024-00123",
    "status": "pending",
    "blockchainHash": "0xabc123...",
    "fraudScore": 0.05,
    "estimatedProcessingDays": 7
  }
}
```

#### GET `/api/claims/pending`
**Description:** Retrieve all pending claims (admin/insurer only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
```
?page=1&limit=10&sortBy=dateSubmitted&order=desc
```

**Response:**
```json
{
  "success": true,
  "claims": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalClaims": 47
  }
}
```

#### POST `/api/claims/pending/validate/:claimId`
**Description:** Validate a pending claim (fraud check + document verification)

**Parameters:**
- `claimId`: Claim identifier

**Response:**
```json
{
  "success": true,
  "validationResult": {
    "isFraudulent": false,
    "documentsValid": true,
    "recommendedAction": "approve",
    "confidence": 0.95
  }
}
```

#### POST `/api/claims/approved/approve`
**Description:** Approve a claim for payment

**Request Body:**
```json
{
  "claimId": "CLM-2024-00123",
  "approvedAmount": 4800,
  "notes": "Approved with standard deductible applied"
}
```

#### GET `/api/claims/rejected`
**Description:** Get list of rejected claims

#### POST `/api/claims/dispute/:claimId`
**Description:** File a dispute for a rejected claim

#### GET `/api/claims/analytics`
**Description:** Get analytics dashboard data (admin only)

**Response:**
```json
{
  "totalClaims": 1250,
  "pendingClaims": 47,
  "approvedClaims": 980,
  "rejectedClaims": 223,
  "totalAmountClaimed": 12500000,
  "totalAmountPaid": 10200000,
  "averageProcessingTime": 5.2,
  "fraudDetectionRate": 0.08
}
```

---

### 4. File Upload Routes (`/api`)

#### POST `/api/upload`
**Description:** Upload general files (Cloudinary)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

#### POST `/api/upload-report`
**Description:** Upload medical reports (IPFS via Pinata)

**Returns:**
```json
{
  "success": true,
  "ipfsHash": "Qm...",
  "url": "https://gateway.pinata.cloud/ipfs/Qm..."
}
```

#### GET `/api/reports`
**Description:** Retrieve all uploaded reports for the authenticated user

---

### 5. Contact & Chatbot Routes

#### POST `/api/contact/send`
**Description:** Send contact form email to admin

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about claims",
  "message": "How long does claim processing take?"
}
```

#### POST `/api/chatbot/send`
**Description:** Send message to AI chatbot

**Request Body:**
```json
{
  "message": "What is the status of my claim CLM-2024-00123?",
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Your claim CLM-2024-00123 is currently under review. Expected processing time is 3-5 business days.",
  "context": {
    "claimStatus": "pending",
    "lastUpdated": "2024-01-16T10:30:00.000Z"
  }
}
```

---

### 6. Admin Routes (`/api/users`)

**Note:** All admin routes require JWT token with `role: 'admin'`

#### GET `/api/users`
**Description:** Get all users in the system

**Query Parameters:**
```
?role=patient&status=active&page=1&limit=20
```

#### POST `/api/users`
**Description:** Create new user (admin only)

#### PUT `/api/users/:userId/role`
**Description:** Change user role

**Request Body:**
```json
{
  "role": "insurer"
}
```

#### PUT `/api/users/:userId/deactivate`
**Description:** Deactivate/suspend user account

#### GET `/api/users/activity-log`
**Description:** Get system activity logs

---

## 🚀 Getting Started

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp ../docs/env.example .env
# Edit .env with your actual values

# Start MongoDB (if running locally)
mongod --dbpath /path/to/db

# Start development server
npm run dev

# Or start production server
npm start
```

### Development Mode
```bash
npm run dev
# Uses nodemon for auto-restart on file changes
# Runs on http://localhost:5000
```

### Production Mode
```bash
npm start
# Stable production server
# Should be run with PM2 or similar process manager
```

---

## 🔌 External Service Integrations

### Blockchain Integration

The backend connects to Ethereum smart contracts for:
- **Claim verification**: Immutable record of all claims
- **Doctor credential verification**: Decentralized identity management
- **Audit trail**: Transparent transaction history

**Implementation:**
```javascript
// backend/services/blockchain.js
const Web3 = require('web3');
const web3 = new Web3(process.env.GANACHE_URL);

const contract = new web3.eth.Contract(
  contractABI,
  process.env.CONTRACT_ADDRESS
);

// Record claim on blockchain
async function recordClaim(claimData) {
  const accounts = await web3.eth.getAccounts();
  const result = await contract.methods
    .submitClaim(claimData.id, claimData.amount)
    .send({ from: accounts[0], gas: 3000000 });
  return result.transactionHash;
}
```

### AI Fraud Detection

Integration with Python ML service for fraud detection:
- **Endpoint:** `http://localhost:5001/predict`
- **Method:** POST
- **Purpose:** Analyze claims for fraudulent patterns

**Implementation:**
```javascript
// backend/services/predictFraud.js
const axios = require('axios');

async function predictFraud(claimData) {
  const response = await axios.post('http://localhost:5001/predict', {
    DiagnosisCode: claimData.diagnosisCode,
    TreatmentCode: claimData.treatmentCode,
    ClaimAmount: claimData.amount,
    IsDuplicate: claimData.isDuplicate || 'Unknown'
  });
  return response.data.fraud;
}
```

### Email Service

Uses **Nodemailer** for transactional emails:
- Password reset emails
- Claim status notifications
- Admin alerts
- Contact form submissions

**Configuration:**
```javascript
// backend/nodemailer/main.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## 🛡️ Security Features

### JWT Authentication
- **Token Expiration:** 24 hours
- **Refresh Strategy:** Client-side token refresh
- **Storage:** HTTP-only cookies (recommended) or localStorage

### Password Security
- **Hashing:** bcrypt with salt rounds = 10
- **Requirements:** Min 8 characters, uppercase, lowercase, number
- **Reset Tokens:** Expire after 1 hour

### Rate Limiting
- **Email endpoints:** 5 requests per 15 minutes per IP
- **Login attempts:** 5 per hour per email
- **API calls:** 100 per 15 minutes per user

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test specific file
npm test -- authController.test.js
```

---

## 📊 Monitoring & Logging

### Activity Logs
All critical actions are logged in the database:
- User authentication events
- Claim submissions and status changes
- Admin actions
- Failed authentication attempts

### Error Handling
Centralized error handling middleware:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

---

## 📦 Dependencies

### Core
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

### File Handling
- `multer`: File upload middleware
- `cloudinary`: Cloud storage
- `pinata-sdk`: IPFS integration

### External Services
- `nodemailer`: Email service
- `axios`: HTTP client
- `web3`: Ethereum blockchain interaction

### Security
- `express-rate-limit`: Rate limiting
- `helmet`: Security headers
- `express-validator`: Input validation

---

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running and MONGO_URI is correct

**JWT Token Errors**
```
Error: jwt malformed
```
**Solution:** Check JWT_SECRET in .env and token format in requests

**File Upload Issues**
```
Error: Unexpected field
```
**Solution:** Ensure form field names match multer configuration

**Blockchain Connection Failed**
```
Error: Invalid JSON RPC response
```
**Solution:** Verify Ganache/Hardhat node is running on correct port

---

## 📈 Performance Optimization

- **Database Indexing:** Indexed fields for faster queries
- **Caching:** Redis integration for frequently accessed data
- **Compression:** Gzip middleware for response compression
- **Connection Pooling:** MongoDB connection pool management

---

## 🚢 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name healthcare-backend
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t healthcare-backend .
docker run -p 5000:5000 --env-file .env healthcare-backend
```

### Platform-Specific Deployment
- **Render:** Connect GitHub repo, set environment variables
- **Railway:** Deploy from CLI or GitHub integration
- **Heroku:** Use Procfile and Heroku Postgres add-on
- **AWS EC2:** Deploy with PM2 and nginx reverse proxy

