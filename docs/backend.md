# 🔧 Backend Architecture & Setup Guide

The backend serves as the core API server for the healthcare platform, built with Node.js and Express.js, providing robust, scalable, and secure endpoints for all healthcare operations.

## 🚀 Quick Start

**Default Configuration:**
- **Port:** 5000 (configurable via `PORT` environment variable)
- **Base URL:** `http://localhost:5000` (development)
- **Start Command:** `npm run dev` (development with hot reload)
- **Production Command:** `npm start`

```bash
cd backend
npm install
npm run dev
```

---

## 🏗️ Architecture Overview

### Core Technologies
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js (v4.18+)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary + IPFS (Pinata)
- **Email Service:** Nodemailer
- **Blockchain:** Web3.js for Ethereum integration
- **AI/ML:** Integration with Python Flask service

### Design Patterns
- **MVC Architecture:** Models, Controllers, Routes separation
- **Middleware Pattern:** Authentication, validation, error handling
- **Repository Pattern:** Data access abstraction
- **Service Layer:** Business logic separation
- **Event-Driven:** Asynchronous operations handling

---

## 🔐 Environment Configuration

### Required Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/healthcare-system
# Alternative: MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-system

# Authentication & Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret-key

# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# File Storage (Cloudinary)
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# IPFS Storage (Pinata)
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key

# AI/ML Services
GEMINI_API_KEY=your-google-gemini-api-key
OPENAI_API_KEY=your-openai-api-key  # Optional
FRAUD_DETECTION_SERVICE_URL=http://localhost:5001

# Blockchain Configuration
INFURA_API_KEY=your-infura-project-id
PRIVATE_KEY=your-ethereum-private-key
NETWORK_URL=http://127.0.0.1:7545  # Ganache local
CONTRACT_ADDRESS=0x...  # Deployed contract address

# Application Settings
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

---

## 🛣️ API Routes Architecture

### Authentication Routes (`/api/auth`)
**File:** `routes/authRoutes.js`
- `POST /register` - User registration with email verification
- `POST /login` - User authentication with JWT token generation
- `POST /logout` - Secure logout with token invalidation
- `POST /forgot-password` - Password reset email dispatch
- `POST /reset-password` - Password reset with token validation
- `POST /verify-email` - Email verification completion

**Features:**
- bcrypt password hashing
- JWT token generation and validation
- Email verification workflow
- Rate limiting on sensitive endpoints
- Account lockout after failed attempts

### User Management Routes (`/api/user`)
**File:** `routes/userRoutes.js`
- `GET /profile` - Retrieve authenticated user profile
- `PUT /profile` - Update user profile information
- `POST /upload-avatar` - Profile picture upload
- `GET /health-records` - Personal health record access
- `PUT /preferences` - User preference settings

**Middleware:** JWT authentication required for all endpoints

### Claims Management Routes (`/api/claims/*`)

#### Patient Claims (`/api/_claims`)
**File:** `routes/claimSubmissionRoutes.js`
- `POST /submit` - Submit new insurance claim with blockchain verification
- `GET /my-claims` - Retrieve user's claim history
- `GET /:claimId/status` - Get specific claim status

#### Pending Claims (`/api/claims/pending`)
**File:** `routes/pendingClaimRoute.js`
- `GET /` - List all pending claims (Admin/Insurer)
- `GET /:claimId` - Get detailed claim information
- `POST /validate/:claimId` - Validate claim documents
- `POST /review/:claimId` - Submit claim review decision
- `POST /upload-report` - Upload additional documentation

#### Approved Claims (`/api/claims/approved`)
**File:** `routes/claimApprovalRoutes.js`
- `POST /approve` - Approve claim for payment
- `GET /` - List approved claims
- `POST /payment-confirmation` - Confirm payment processing

#### General Claims (`/api/claims`)
**File:** `routes/claimsRoutes.js`
- `POST /submit` - Doctor/Provider claim submission
- `GET /rejected` - Retrieve rejected claims
- `POST /dispute/:claimId` - Submit claim dispute
- `GET /analytics` - Claims analytics and reporting

### Document Management Routes (`/api/`)
**File:** `routes/uploadRoutes.js`
- `POST /upload` - General file upload with AI processing
- `POST /upload-report` - Medical report upload
- `GET /reports` - Retrieve uploaded documents
- `DELETE /document/:id` - Delete document
- `GET /document/:id/download` - Download document

**Features:**
- Multer middleware for file handling
- Cloudinary integration for cloud storage
- IPFS storage for decentralized backup
- AI-powered document analysis
- Virus scanning and validation

### AI Services Routes (`/api/chatbot`)
**File:** `routes/chatbotRoutes.js`
- `POST /send` - Send message to AI health assistant
- `GET /conversation/:id` - Retrieve conversation history
- `POST /feedback` - Submit chatbot response feedback

**Integration:**
- Google Gemini API for natural language processing
- Context-aware responses based on user health data
- Medical knowledge base integration

### Analytics & Reporting Routes (`/api/reports`)
**File:** `routes/reportRoutes.js`
- `POST /generate` - Generate custom reports
- `POST /send-email` - Email report to stakeholders
- `GET /templates` - Available report templates
- `GET /:reportId/download` - Download generated report

### Admin Routes (`/api/users`)
**File:** `routes/userManagementRoutes.js`
- `GET /` - List all users with filtering
- `POST /` - Create new user account
- `PUT /:userId/role` - Update user role
- `PUT /:userId/deactivate` - Deactivate user account
- `GET /activity-log` - System activity logs
- `GET /statistics` - Platform usage statistics

**Authorization:** Admin role required

### Additional Routes

#### Insurance Routes (`/api/insurance`)
- `GET /:claimId` - Insurance policy information

#### Claim Tracking (`/api/claim-tracker`)
- `GET /:claimId` - Real-time claim tracking

#### Claim History (`/api/claim-history`)
- `GET /history` - Comprehensive claim history with filters

#### Contact Routes (`/api/contact`)
- `POST /send` - Contact form submission

#### Quote Routes (`/api/quote`)
- `POST /get-quote` - Insurance quote generation

---

## 🔧 Middleware Architecture

### Authentication Middleware
**File:** `middleware/authMiddleware.js`
```javascript
// JWT token validation and user context injection
const authenticateToken = (req, res, next) => {
  // Token extraction, validation, and user attachment
}
```

### Authorization Middleware
**File:** `middleware/verifyToken.js`
```javascript
// Role-based access control
const requireRole = (roles) => (req, res, next) => {
  // Role verification logic
}
```

### Validation Middleware
- Request body validation using Joi or express-validator
- File upload validation (size, type, content)
- Input sanitization for XSS prevention

### Error Handling Middleware
- Centralized error processing
- Structured error responses
- Logging integration
- Stack trace sanitization for production

### Rate Limiting Middleware
- IP-based rate limiting
- User-based rate limiting
- Endpoint-specific limits
- Redis integration for distributed systems

---

## 🗄️ Database Models

### User Model (`models/User.js`)
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: Enum['patient', 'healthcare_provider', 'insurer', 'admin'],
  profile: {
    phone: String,
    dateOfBirth: Date,
    address: Object,
    healthProfile: Object,
    insuranceInfo: Object
  },
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Claim Model (`models/Claim.js`)
```javascript
{
  claimId: String (unique),
  patientId: ObjectId (ref: 'User'),
  providerId: ObjectId (ref: 'User'),
  claimType: String,
  amount: Number,
  status: Enum,
  documents: Array,
  blockchainHash: String,
  ipfsHash: String,
  fraudScore: Number,
  aiAnalysis: Object,
  reviewHistory: Array,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Development Workflow

### Local Development Setup
```bash
# Clone repository
git clone <repository-url>
cd healthcare-platform/backend

# Install dependencies
npm install

# Setup environment
cp ../docs/env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Check code coverage
npm run coverage
```

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run build` - Build for production
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Code Quality Tools
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **Jest** - Unit and integration testing
- **Supertest** - API endpoint testing

---

## 🔍 Monitoring & Logging

### Logging Configuration
- **Winston** for structured logging
- Log levels: error, warn, info, debug
- File rotation for log management
- JSON format for log parsing

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Comprehensive system status
- Database connectivity check
- External service availability check

### Performance Monitoring
- Request/response time tracking
- Memory usage monitoring
- Database query performance
- Error rate tracking

---

## 🔒 Security Features

### Data Protection
- Password hashing with bcrypt
- JWT token encryption
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### API Security
- CORS configuration
- Rate limiting
- Request size limits
- Helmet.js security headers
- HTTPS enforcement in production

### Blockchain Security
- Private key management
- Transaction signing
- Smart contract interaction security
- Gas optimization

---

## 🚀 Deployment

### Production Considerations
- Environment variable management
- Database connection pooling
- Caching strategy (Redis)
- Load balancing
- SSL/TLS configuration
- Process management (PM2)

### Docker Configuration
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Health Monitoring
- Uptime monitoring
- Error tracking (Sentry)
- Performance metrics
- Database monitoring
- Log aggregation

