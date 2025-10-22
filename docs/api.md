# 🚀 Healthcare Platform API Reference

**Base URL:** `http://localhost:5000` (Development) | `https://your-domain.com` (Production)

**API Version:** v1  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token (where specified)

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Claims Management](#claims-management)
- [Document Management](#document-management)
- [AI Services](#ai-services)
- [Analytics & Reporting](#analytics--reporting)
- [Admin Operations](#admin-operations)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### POST `/api/auth/register`
Register a new user account with email verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "patient",
  "phone": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john.doe@example.com",
    "role": "patient",
    "isVerified": false
  }
}
```

### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "patient",
      "isVerified": true,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "expiresIn": "7d"
  }
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

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

### POST `/api/auth/reset-password`
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePassword123!"
}
```

---

## 👤 User Management

### GET `/api/user/profile`
Get current user's profile information.

**Headers:** `Authorization: Bearer <jwt-token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "phone": "+1234567890",
    "dateOfBirth": "1990-05-15",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "healthProfile": {
      "bloodType": "O+",
      "allergies": ["Penicillin", "Shellfish"],
      "chronicConditions": ["Hypertension"],
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "+1234567891",
        "relationship": "Spouse"
      }
    },
    "insuranceInfo": {
      "provider": "HealthCorp Insurance",
      "policyNumber": "HC-123456789",
      "groupNumber": "GRP-001",
      "effectiveDate": "2024-01-01",
      "expirationDate": "2024-12-31"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT `/api/user/profile`
Update user profile information.

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567899",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  },
  "healthProfile": {
    "bloodType": "O+",
    "allergies": ["Penicillin"],
    "chronicConditions": ["Hypertension", "Diabetes Type 2"]
  }
}
```

---

## 🏥 Claims Management

### POST `/api/_claims/submit`
Submit a new insurance claim (Patient).

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "claimType": "medical",
  "description": "Emergency room visit for chest pain",
  "amount": 2500.00,
  "dateOfService": "2024-01-10",
  "providerId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "diagnosisCode": "R06.02",
  "treatmentCode": "99284",
  "documents": [
    {
      "type": "medical_bill",
      "url": "https://cloudinary.com/documents/bill_123.pdf",
      "filename": "emergency_bill.pdf"
    },
    {
      "type": "medical_report",
      "url": "https://cloudinary.com/documents/report_123.pdf",
      "filename": "chest_xray_report.pdf"
    }
  ],
  "blockchainHash": "0x1234567890abcdef...",
  "ipfsHash": "QmXyZ123..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "data": {
    "claimId": "CLM-2024-001234",
    "status": "submitted",
    "submissionDate": "2024-01-15T10:30:00.000Z",
    "estimatedProcessingTime": "3-5 business days",
    "trackingNumber": "TRK-ABC123XYZ",
    "blockchainTxHash": "0xabcdef1234567890...",
    "fraudScore": 0.15,
    "aiAnalysis": {
      "riskLevel": "low",
      "confidence": 0.92,
      "flags": []
    }
  }
}
```

### GET `/api/claims/pending`
Get all pending claims (Admin/Insurer).

**Headers:** `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): asc/desc (default: desc)
- `filterBy` (optional): Filter by status, amount, etc.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "claims": [
      {
        "claimId": "CLM-2024-001234",
        "patientName": "John Doe",
        "patientId": "64f8a1b2c3d4e5f6a7b8c9d0",
        "claimType": "medical",
        "amount": 2500.00,
        "status": "pending_review",
        "submissionDate": "2024-01-15T10:30:00.000Z",
        "priority": "normal",
        "fraudScore": 0.15,
        "aiRecommendation": "approve",
        "documentsCount": 2,
        "providerName": "City General Hospital"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### POST `/api/claims/pending/review/:claimId`
Review and process a pending claim.

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "action": "approve",
  "reviewNotes": "All documentation verified. Medical necessity confirmed.",
  "approvedAmount": 2500.00,
  "adjustments": [],
  "reviewerId": "64f8a1b2c3d4e5f6a7b8c9d2"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Claim reviewed successfully",
  "data": {
    "claimId": "CLM-2024-001234",
    "status": "approved",
    "approvedAmount": 2500.00,
    "reviewDate": "2024-01-16T14:20:00.000Z",
    "paymentScheduled": "2024-01-18T00:00:00.000Z",
    "blockchainTxHash": "0xdef456789abc...",
    "notificationSent": true
  }
}
```

### GET `/api/claim-tracker/:claimId`
Track claim status and progress.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "claimId": "CLM-2024-001234",
    "currentStatus": "approved",
    "timeline": [
      {
        "status": "submitted",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "description": "Claim submitted by patient",
        "actor": "John Doe"
      },
      {
        "status": "under_review",
        "timestamp": "2024-01-15T11:00:00.000Z",
        "description": "Claim assigned to reviewer",
        "actor": "System"
      },
      {
        "status": "approved",
        "timestamp": "2024-01-16T14:20:00.000Z",
        "description": "Claim approved for payment",
        "actor": "Dr. Sarah Wilson"
      }
    ],
    "estimatedCompletion": "2024-01-18T00:00:00.000Z",
    "nextSteps": [
      "Payment processing initiated",
      "Funds will be transferred within 2 business days"
    ]
  }
}
```

---

## 📄 Document Management

### POST `/api/upload`
Upload medical documents with automatic processing.

**Headers:** 
- `Authorization: Bearer <jwt-token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Document file (PDF, JPG, PNG)
- `documentType`: Type of document (medical_bill, prescription, lab_report, etc.)
- `claimId`: Associated claim ID (optional)
- `description`: Document description

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "DOC-2024-001234",
    "filename": "lab_report_2024.pdf",
    "originalName": "Blood Test Results.pdf",
    "size": 245760,
    "mimeType": "application/pdf",
    "cloudinaryUrl": "https://res.cloudinary.com/healthcare/document_123.pdf",
    "ipfsHash": "QmXyZ789...",
    "uploadDate": "2024-01-15T10:30:00.000Z",
    "aiAnalysis": {
      "documentType": "lab_report",
      "confidence": 0.98,
      "extractedData": {
        "patientName": "John Doe",
        "testDate": "2024-01-10",
        "testType": "Complete Blood Count",
        "results": [
          {
            "parameter": "Hemoglobin",
            "value": "14.2",
            "unit": "g/dL",
            "normalRange": "13.5-17.5",
            "status": "normal"
          }
        ]
      }
    }
  }
}
```

### GET `/api/reports`
Get user's uploaded documents and reports.

**Headers:** `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `type` (optional): Filter by document type
- `claimId` (optional): Filter by claim ID
- `dateFrom` (optional): Filter from date
- `dateTo` (optional): Filter to date

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "documentId": "DOC-2024-001234",
        "filename": "lab_report_2024.pdf",
        "documentType": "lab_report",
        "uploadDate": "2024-01-15T10:30:00.000Z",
        "size": 245760,
        "url": "https://res.cloudinary.com/healthcare/document_123.pdf",
        "claimId": "CLM-2024-001234",
        "status": "processed"
      }
    ],
    "totalSize": 1048576,
    "totalDocuments": 15
  }
}
```

---

## 🤖 AI Services

### POST `/api/chatbot/send`
Send message to AI health assistant.

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "message": "What are the side effects of metformin?",
  "context": {
    "conversationId": "CONV-123456",
    "userMedications": ["Metformin", "Lisinopril"],
    "userConditions": ["Type 2 Diabetes", "Hypertension"]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "response": "Metformin is generally well-tolerated, but common side effects may include:\n\n• Gastrointestinal issues (nausea, diarrhea, stomach upset)\n• Metallic taste in mouth\n• Decreased appetite\n• Vitamin B12 deficiency with long-term use\n\nRare but serious: Lactic acidosis (seek immediate medical attention if you experience muscle pain, difficulty breathing, or unusual fatigue).\n\nAlways consult your healthcare provider about any concerns with your medications.",
    "conversationId": "CONV-123456",
    "messageId": "MSG-789012",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "confidence": 0.95,
    "sources": [
      "FDA Drug Information",
      "Medical Literature Database"
    ],
    "suggestedActions": [
      "Schedule medication review with doctor",
      "Monitor blood sugar levels",
      "Report any unusual symptoms"
    ]
  }
}
```

### POST `/api/fraud-detection/analyze`
Analyze claim for potential fraud using AI.

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "claimId": "CLM-2024-001234",
  "claimData": {
    "amount": 2500.00,
    "diagnosisCode": "R06.02",
    "treatmentCode": "99284",
    "providerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "patientHistory": {
      "previousClaims": 3,
      "averageClaimAmount": 800.00,
      "lastClaimDate": "2023-11-15"
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "fraudScore": 0.15,
    "riskLevel": "low",
    "confidence": 0.92,
    "analysis": {
      "flags": [],
      "positiveIndicators": [
        "Consistent with patient medical history",
        "Provider has good reputation",
        "Claim amount within normal range for procedure"
      ],
      "recommendation": "approve",
      "reviewRequired": false
    },
    "modelVersion": "v2.1.0",
    "processedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📊 Analytics & Reporting

### GET `/api/claims/analytics`
Get comprehensive claims analytics (Admin/Insurer).

**Headers:** `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `period` (optional): daily, weekly, monthly, yearly
- `startDate` (optional): Start date for analysis
- `endDate` (optional): End date for analysis

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalClaims": 1247,
      "totalAmount": 2456780.50,
      "approvedClaims": 1089,
      "rejectedClaims": 158,
      "approvalRate": 87.3,
      "averageProcessingTime": "4.2 days",
      "fraudDetected": 23,
      "fraudRate": 1.8
    },
    "trends": {
      "claimsOverTime": [
        {
          "date": "2024-01-01",
          "claims": 45,
          "amount": 89750.00
        }
      ],
      "fraudTrends": [
        {
          "date": "2024-01-01",
          "fraudAttempts": 2,
          "detectionRate": 100
        }
      ]
    },
    "topProviders": [
      {
        "providerId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "City General Hospital",
        "claimsCount": 156,
        "totalAmount": 345600.00,
        "averageAmount": 2215.38
      }
    ],
    "claimTypes": [
      {
        "type": "emergency",
        "count": 234,
        "percentage": 18.8
      },
      {
        "type": "routine",
        "count": 567,
        "percentage": 45.5
      }
    ]
  }
}
```

### POST `/api/reports/generate`
Generate custom reports.

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "reportType": "claims_summary",
  "parameters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "includeCharts": true,
    "format": "pdf",
    "filters": {
      "claimStatus": ["approved", "rejected"],
      "amountRange": {
        "min": 100,
        "max": 10000
      }
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "reportId": "RPT-2024-001234",
    "downloadUrl": "https://reports.healthcare.com/download/RPT-2024-001234.pdf",
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-22T10:30:00.000Z",
    "fileSize": 2048576,
    "pageCount": 15
  }
}
```

---

## 👨‍💼 Admin Operations

### GET `/api/users`
Get all users with filtering and pagination (Admin only).

**Headers:** `Authorization: Bearer <jwt-token>`

**Query Parameters:**
- `role` (optional): Filter by user role
- `status` (optional): Filter by account status
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by name or email

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "patient",
        "status": "active",
        "isVerified": true,
        "lastLogin": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "claimsCount": 5,
        "totalClaimAmount": 12500.00
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 25,
      "totalItems": 247,
      "itemsPerPage": 10
    }
  }
}
```

### PUT `/api/users/:userId/role`
Update user role (Admin only).

**Headers:** `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "role": "healthcare_provider",
  "reason": "Verified medical license and credentials"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "previousRole": "patient",
    "newRole": "healthcare_provider",
    "updatedBy": "64f8a1b2c3d4e5f6a7b8c9d2",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## ⚠️ Error Handling

All API endpoints follow a consistent error response format:

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service unavailable |

---

## 🚦 Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute per IP
- **File upload endpoints**: 10 requests per hour per user
- **General API endpoints**: 100 requests per hour per user
- **Admin endpoints**: 200 requests per hour per admin user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

When rate limit is exceeded:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 3600
  }
}
```

