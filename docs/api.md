# API Reference Documentation

## 🌐 Base Information

- **Base URL**: `http://localhost:5000`
- **API Version**: v1
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer Token (where required)

## 🔐 Authentication Endpoints

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "patient",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "64a1b2c3d4e5f6789abcdef0",
    "email": "john.doe@example.com",
    "role": "patient",
    "isEmailVerified": false
  }
}
```

### POST `/api/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "patient"
    },
    "expiresIn": "7d"
  }
}
```

### POST `/api/auth/logout`
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### POST `/api/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST `/api/auth/reset-password`
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## 👤 User Management

### GET `/api/user/profile`
Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789abcdef0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2023-07-01T10:00:00Z",
    "lastLogin": "2023-07-15T14:30:00Z"
  }
}
```

### PUT `/api/user/profile`
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789abcdef0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "phoneNumber": "+1234567890",
    "address": {
      "street": "456 Oak Ave",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02101",
      "country": "USA"
    },
    "updatedAt": "2023-07-15T15:45:00Z"
  }
}
```

## 📞 Contact & Support

### POST `/api/contact/send`
Send contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Insurance Claim Question",
  "message": "I have a question about my recent insurance claim...",
  "phoneNumber": "+1234567890",
  "category": "claims"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact message sent successfully",
  "data": {
    "messageId": "msg_64a1b2c3d4e5f6789abcdef0",
    "timestamp": "2023-07-15T16:00:00Z"
  }
}
```

## 🤖 AI Chatbot

### POST `/api/chatbot/send`
Send message to AI chatbot.

**Headers:** `Authorization: Bearer <token>` (optional)

**Request Body:**
```json
{
  "message": "What is the status of my claim?",
  "context": {
    "userId": "64a1b2c3d4e5f6789abcdef0",
    "sessionId": "session_123456789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I can help you check your claim status. Let me look that up for you...",
    "sessionId": "session_123456789",
    "timestamp": "2023-07-15T16:15:00Z",
    "suggestions": [
      "View all my claims",
      "Submit a new claim",
      "Contact support"
    ]
  }
}
```

## 📁 File Management

### POST `/api/upload`
Upload general files (images, documents).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `multipart/form-data`
- `file`: File to upload
- `category`: File category (optional)
- `description`: File description (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "file_64a1b2c3d4e5f6789abcdef0",
    "fileName": "medical_report.pdf",
    "fileSize": 2048576,
    "fileType": "application/pdf",
    "uploadUrl": "https://cloudinary.com/...",
    "ipfsHash": "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    "uploadedAt": "2023-07-15T16:30:00Z"
  }
}
```

### POST `/api/upload-report`
Upload medical reports specifically.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `multipart/form-data`
- `files`: Array of files
- `claimId`: Associated claim ID (optional)
- `reportType`: Type of medical report

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadedFiles": [
      {
        "fileId": "file_64a1b2c3d4e5f6789abcdef0",
        "fileName": "lab_results.pdf",
        "reportType": "lab_results",
        "uploadUrl": "https://cloudinary.com/...",
        "ipfsHash": "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx"
      }
    ],
    "totalFiles": 1,
    "uploadedAt": "2023-07-15T16:45:00Z"
  }
}
```

### GET `/api/reports`
Get user's uploaded reports.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `type`: Filter by report type (optional)
- `dateFrom`: Start date filter (optional)
- `dateTo`: End date filter (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "fileId": "file_64a1b2c3d4e5f6789abcdef0",
        "fileName": "lab_results.pdf",
        "reportType": "lab_results",
        "fileSize": 2048576,
        "uploadUrl": "https://cloudinary.com/...",
        "uploadedAt": "2023-07-15T16:45:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

## 📋 Claims Management

### POST `/api/_claims/submit`
Submit a new insurance claim.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "claimType": "medical",
  "policyNumber": "POL123456789",
  "incidentDate": "2023-07-10",
  "description": "Emergency room visit for chest pain",
  "amount": 2500.00,
  "currency": "USD",
  "hospitalName": "City General Hospital",
  "doctorName": "Dr. Smith",
  "diagnosis": "Chest pain evaluation",
  "treatment": "ECG, blood tests, consultation",
  "attachments": [
    "file_64a1b2c3d4e5f6789abcdef0",
    "file_64a1b2c3d4e5f6789abcdef1"
  ],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "data": {
    "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
    "claimNumber": "CLM-2023-001234",
    "status": "pending",
    "submittedAt": "2023-07-15T17:00:00Z",
    "estimatedProcessingTime": "5-7 business days",
    "trackingUrl": "/track-claim/claim_64a1b2c3d4e5f6789abcdef0"
  }
}
```

### GET `/api/claims/pending`
Get pending claims (Admin/Insurer only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (optional)
- `dateFrom`: Start date filter (optional)
- `dateTo`: End date filter (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "claims": [
      {
        "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
        "claimNumber": "CLM-2023-001234",
        "patientName": "John Doe",
        "patientId": "64a1b2c3d4e5f6789abcdef0",
        "claimType": "medical",
        "amount": 2500.00,
        "status": "pending",
        "submittedAt": "2023-07-15T17:00:00Z",
        "priority": "normal"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10
    }
  }
}
```

### POST `/api/claims/approved/approve`
Approve a claim (Admin/Insurer only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
  "approvedAmount": 2500.00,
  "notes": "Claim approved after verification",
  "paymentMethod": "direct_deposit",
  "paymentDate": "2023-07-20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim approved successfully",
  "data": {
    "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
    "status": "approved",
    "approvedAmount": 2500.00,
    "approvedBy": "admin_user_id",
    "approvedAt": "2023-07-15T18:00:00Z",
    "paymentReference": "PAY-2023-001234"
  }
}
```

### POST `/api/claims/reject`
Reject a claim with reason.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
  "reason": "Insufficient documentation",
  "notes": "Please provide additional medical records",
  "canResubmit": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim rejected",
  "data": {
    "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
    "status": "rejected",
    "reason": "Insufficient documentation",
    "rejectedBy": "admin_user_id",
    "rejectedAt": "2023-07-15T18:15:00Z",
    "canResubmit": true
  }
}
```

### GET `/api/claims/analytics`
Get claims analytics and statistics (Admin/Insurer only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d, 1y)
- `groupBy`: Group by (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalClaims": 1250,
      "pendingClaims": 45,
      "approvedClaims": 1100,
      "rejectedClaims": 105,
      "totalAmount": 2500000.00,
      "averageProcessingTime": "3.2 days"
    },
    "trends": [
      {
        "date": "2023-07-01",
        "claimsCount": 25,
        "totalAmount": 50000.00
      }
    ],
    "fraudDetection": {
      "suspiciousClaims": 12,
      "fraudScore": 0.15,
      "riskLevel": "low"
    }
  }
}
```

## 📊 Reports & Analytics

### POST `/api/reports/generate`
Generate custom reports.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reportType": "claims_summary",
  "dateRange": {
    "from": "2023-07-01",
    "to": "2023-07-31"
  },
  "filters": {
    "status": ["approved", "pending"],
    "claimType": "medical"
  },
  "format": "pdf",
  "includeCharts": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "report_64a1b2c3d4e5f6789abcdef0",
    "status": "generating",
    "estimatedCompletionTime": "2-3 minutes",
    "downloadUrl": null
  }
}
```

### POST `/api/reports/send-email`
Send report via email.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reportId": "report_64a1b2c3d4e5f6789abcdef0",
  "recipients": ["admin@company.com", "manager@company.com"],
  "subject": "Monthly Claims Report",
  "message": "Please find attached the monthly claims report."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report sent successfully",
  "data": {
    "emailId": "email_64a1b2c3d4e5f6789abcdef0",
    "sentAt": "2023-07-15T19:00:00Z",
    "recipients": ["admin@company.com", "manager@company.com"]
  }
}
```

## 🏥 Insurance Management

### GET `/api/insurance/:claimId`
Get insurance information for a specific claim.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
    "policy": {
      "policyNumber": "POL123456789",
      "policyType": "comprehensive",
      "coverageAmount": 100000.00,
      "deductible": 1000.00,
      "coveragePercentage": 80
    },
    "benefits": {
      "coveredAmount": 2000.00,
      "patientResponsibility": 500.00,
      "insurancePays": 2000.00
    },
    "networkStatus": "in_network",
    "preApprovalRequired": false
  }
}
```

## 🔍 Claim Tracking

### GET `/api/claim-tracker/:claimId`
Track the status of a specific claim.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
    "claimNumber": "CLM-2023-001234",
    "status": "under_review",
    "progress": 60,
    "timeline": [
      {
        "status": "submitted",
        "timestamp": "2023-07-15T17:00:00Z",
        "description": "Claim submitted successfully"
      },
      {
        "status": "received",
        "timestamp": "2023-07-15T17:05:00Z",
        "description": "Claim received and queued for review"
      },
      {
        "status": "under_review",
        "timestamp": "2023-07-16T09:00:00Z",
        "description": "Claim under review by medical team"
      }
    ],
    "estimatedCompletion": "2023-07-20T17:00:00Z",
    "assignedTo": "Dr. Johnson",
    "lastUpdated": "2023-07-16T14:30:00Z"
  }
}
```

## 📈 Patient Overview

### GET `/api/patient/claim-status-progress`
Get patient's claim status progress.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalClaims": 15,
    "statusBreakdown": {
      "pending": 3,
      "under_review": 2,
      "approved": 8,
      "rejected": 2
    },
    "recentActivity": [
      {
        "claimId": "claim_64a1b2c3d4e5f6789abcdef0",
        "status": "approved",
        "amount": 1500.00,
        "updatedAt": "2023-07-15T16:00:00Z"
      }
    ]
  }
}
```

### GET `/api/patient/notifications`
Get patient's notifications.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unreadOnly`: Show only unread notifications (default: false)
- `limit`: Number of notifications to return (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_64a1b2c3d4e5f6789abcdef0",
        "type": "claim_approved",
        "title": "Claim Approved",
        "message": "Your claim CLM-2023-001234 has been approved for $1,500.00",
        "isRead": false,
        "createdAt": "2023-07-15T16:00:00Z",
        "actionUrl": "/claims/claim_64a1b2c3d4e5f6789abcdef0"
      }
    ],
    "unreadCount": 3
  }
}
```

## 👥 User Management (Admin Only)

### POST `/api/users`
Create a new user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "password": "securePassword123",
  "role": "doctor",
  "phoneNumber": "+1234567890",
  "specialization": "Cardiology",
  "licenseNumber": "MD123456",
  "department": "Cardiology"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "64a1b2c3d4e5f6789abcdef1",
    "email": "jane.smith@company.com",
    "role": "doctor",
    "status": "active",
    "createdAt": "2023-07-15T20:00:00Z"
  }
}
```

### PUT `/api/users/:userId/role`
Update user role (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "admin",
  "reason": "Promoted to admin role"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "userId": "64a1b2c3d4e5f6789abcdef1",
    "oldRole": "doctor",
    "newRole": "admin",
    "updatedAt": "2023-07-15T20:15:00Z"
  }
}
```

### GET `/api/users/activity-log`
Get system activity log (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `userId`: Filter by specific user (optional)
- `action`: Filter by action type (optional)
- `dateFrom`: Start date filter (optional)
- `dateTo`: End date filter (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_64a1b2c3d4e5f6789abcdef0",
        "userId": "64a1b2c3d4e5f6789abcdef0",
        "userName": "John Doe",
        "action": "claim_submitted",
        "description": "Submitted claim CLM-2023-001234",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2023-07-15T17:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 500,
      "itemsPerPage": 50
    }
  }
}
```

## 🔒 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2023-07-15T20:30:00Z",
  "requestId": "req_64a1b2c3d4e5f6789abcdef0"
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ERROR`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## 📝 Rate Limiting

- **General API**: 100 requests per minute per IP
- **Authentication**: 5 login attempts per minute per IP
- **File Upload**: 10 uploads per minute per user
- **Chatbot**: 20 messages per minute per user

## 🔐 Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## 📚 Additional Resources

- **Postman Collection**: Available in `/docs/postman/`
- **OpenAPI Specification**: Available at `/api/docs`
- **Webhook Documentation**: Available in `/docs/webhooks.md`
- **SDK Examples**: Available in `/docs/sdks/`

