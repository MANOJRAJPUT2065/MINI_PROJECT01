# Backend Documentation (Node.js/Express)

## 🚀 Quick Start

- **Port**: 5000 (default)
- **Start Command**: `npm run dev`
- **Base URL**: `http://localhost:5000`
- **Environment**: Node.js with ES6 modules

## 🔧 Environment Configuration

The backend requires several environment variables to function properly. Create a `.env` file in the backend directory:

```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/healthcare-system
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/healthcare-system

# Authentication & Security
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications and password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:3000

# Cloud Storage (Cloudinary for image/file uploads)
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# IPFS Storage (Pinata for decentralized file storage)
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key

# AI Services
GEMINI_API_KEY=your-google-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# Blockchain Configuration
INFURA_API_KEY=your-infura-api-key
PRIVATE_KEY=your-ethereum-private-key
CONTRACT_ADDRESS=your-smart-contract-address

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🏗️ Architecture Overview

The backend follows a modular architecture with clear separation of concerns:

```
backend/
├── controllers/     # Business logic handlers
├── middleware/      # Authentication, validation, error handling
├── models/         # Database schemas and data models
├── routes/         # API endpoint definitions
├── services/       # External service integrations
├── config/         # Database and external service configuration
└── server.js       # Main application entry point
```

## 🔐 Authentication & Authorization

### JWT Token System
- **Token Generation**: Upon successful login, a JWT token is generated with user information
- **Token Validation**: Middleware validates tokens on protected routes
- **Role-based Access**: Different user roles (patient, doctor, insurer, admin) have different permissions
- **Token Expiration**: Configurable token expiration (default: 7 days)

### MetaMask Integration
- **Wallet Connection**: Users can connect their MetaMask wallet
- **Blockchain Authentication**: Wallet signature verification for secure login
- **Smart Contract Interaction**: Direct interaction with deployed smart contracts

## 📊 Database Models

### Core Models
- **User**: Patient, doctor, insurer, and admin user accounts
- **Claim**: Insurance claim submissions and processing
- **Insurance**: Insurance policy information
- **ActivityLog**: System activity tracking
- **AuditLog**: Security and compliance logging

### Data Relationships
```javascript
User (1) -----> (Many) Claims
User (1) -----> (Many) Insurance
Claim (1) -----> (Many) ClaimStatus
User (1) -----> (Many) ActivityLog
```

## 🛡️ Security Features

### Input Validation
- **Express Validator**: Comprehensive input validation for all endpoints
- **Sanitization**: XSS protection and input sanitization
- **Rate Limiting**: Protection against brute force attacks

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for protection against common vulnerabilities

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login (email/password or MetaMask)
- `POST /logout` - User logout
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation

### User Management (`/api/user`)
- `GET /profile` - Get user profile (requires authentication)
- `PUT /profile` - Update user profile (requires authentication)

### Claims Processing (`/api/claims`)
- `POST /submit` - Submit new insurance claim
- `GET /pending` - Get pending claims (admin/insurer only)
- `POST /approve/:claimId` - Approve claim (admin/insurer only)
- `POST /reject/:claimId` - Reject claim with reason
- `GET /analytics` - Claim analytics and statistics

### File Management (`/api/`)
- `POST /upload` - Upload medical documents
- `POST /upload-report` - Upload medical reports
- `GET /reports` - Retrieve user's reports

### AI Services (`/api/chatbot`)
- `POST /send` - Send message to AI chatbot
- `GET /history` - Get chat history (if implemented)

## 🔄 Error Handling

### Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
```

### Custom Error Classes
- **ValidationError**: Input validation failures
- **AuthenticationError**: Authentication failures
- **AuthorizationError**: Permission denied errors
- **NotFoundError**: Resource not found errors

## 📈 Performance Optimization

### Database Optimization
- **Indexing**: Strategic database indexes for frequently queried fields
- **Connection Pooling**: MongoDB connection pooling for better performance
- **Query Optimization**: Efficient database queries with proper projections

### Caching Strategy
- **Redis Integration**: (Optional) Redis for session storage and caching
- **Response Caching**: Cache frequently accessed data
- **Static File Serving**: Efficient static file delivery

## 🧪 Testing

### Test Structure
```bash
backend/
├── tests/
│   ├── unit/          # Unit tests for individual functions
│   ├── integration/   # Integration tests for API endpoints
│   └── fixtures/      # Test data and mock objects
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:watch    # Run tests in watch mode
```

## 🚀 Deployment

### Production Considerations
- **Environment Variables**: All sensitive data in environment variables
- **HTTPS**: SSL/TLS encryption for all communications
- **Logging**: Comprehensive logging for monitoring and debugging
- **Health Checks**: Health check endpoints for load balancers
- **Graceful Shutdown**: Proper cleanup on application shutdown

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Routes (mounted under server.js)
- /api/auth: register, login, logout, forgot-password, reset-password
- /api/user: GET /profile, PUT /user/profile (auth)
- /api/contact: POST /send
- /api/chatbot: POST /send
- /api/: POST /upload, POST /upload-report, GET /reports
- /api/claims: doctor claim submit (multer); rejected, dispute/:claimId, analytics
- /api/reports: POST /generate, POST /send-email
- /api/users: admin CRUD and logs (JWT + admin)
- /api/compliance: GET /, POST /
- /api/activity-logs: GET /, POST /
- /api/insurance: GET /:claimId
- /api/claim-history: GET /history
- /api/claim-tracker: GET /:claimId
- /api/quote: POST /get-quote
- /api/_claims: POST /submit (blockchain + DB)
- /api/claims/approved: POST /approve
- /api/claims/pending: GET /pending, POST /validate/:claimId, POST /claims/upload-report, GET /claim/:claimId, POST /review/:claimId
- /api/reviewclaims: POST /review/:claimId

### Start
```bash
cd backend
npm install
npm run dev
```

