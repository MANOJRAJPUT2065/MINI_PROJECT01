# API Reference Documentation

## 📋 Overview

This comprehensive API reference provides detailed documentation for all endpoints in the Healthcare System backend. All endpoints are RESTful and return JSON responses.

**Base URL:** `http://localhost:5000`  
**Production URL:** `https://your-api-domain.com`  
**API Version:** v1  
**Authentication:** JWT Bearer Token (where indicated)

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifecycle
- **Expiration:** 24 hours from issuance
- **Renewal:** Request new token via login endpoint
- **Storage:** Store securely (HTTP-only cookies recommended)

---

## 📚 Table of Contents

1. [Authentication Endpoints](#1-authentication-endpoints)
2. [User Management](#2-user-management)
3. [Claims Management](#3-claims-management)
4. [File Upload](#4-file-upload)
5. [Communication](#5-communication)
6. [Admin Operations](#6-admin-operations)
7. [Analytics & Reports](#7-analytics--reports)
8. [Error Handling](#8-error-handling)

---

## 1. Authentication Endpoints

Base Path: `/api/auth`

### 1.1 Register New User

**Endpoint:** `POST /api/auth/register`  
**Authentication:** Not required  
**Description:** Create a new user account in the system

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd",
  "role": "patient",
  "phone": "+1-555-0123",
  "dateOfBirth": "1990-05-15",
  "address": "123 Main Street, Anytown, ST 12345",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" // Optional
}
```

**Validation Rules:**
- `name`: Required, min 2 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain uppercase, lowercase, number, special character
- `role`: Required, one of: `patient`, `insurer`, `admin`
- `phone`: Optional, valid phone format
- `dateOfBirth`: Optional, valid date (YYYY-MM-DD)
- `walletAddress`: Optional, valid Ethereum address

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "phone": "+1-555-0123",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}

// 409 Conflict - Duplicate User
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 1.2 User Login

**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required  
**Description:** Authenticate user and receive JWT token

**Request Body (Email/Password):**
```json
{
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd"
}
```

**Request Body (MetaMask):**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x1234567890abcdef...",
  "message": "Login to Healthcare System: 1705315800000"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized - Invalid Credentials
{
  "success": false,
  "message": "Invalid email or password"
}

// 403 Forbidden - Account Suspended
{
  "success": false,
  "message": "Your account has been suspended. Please contact support."
}

// 429 Too Many Requests - Rate Limit
{
  "success": false,
  "message": "Too many login attempts. Please try again in 1 hour."
}
```

---

### 1.3 User Logout

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required (JWT)  
**Description:** Invalidate current session and token

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.4 Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`  
**Authentication:** Not required  
**Description:** Send password reset link to user's email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email. Link expires in 1 hour."
}
```

**Note:** For security, always returns success even if email doesn't exist

---

### 1.5 Reset Password

**Endpoint:** `POST /api/auth/reset-password`  
**Authentication:** Not required (uses token from email)  
**Description:** Reset user password using token

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "newPassword": "NewSecureP@ssw0rd123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid/Expired Token
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## 2. User Management

Base Path: `/api/user`

### 2.1 Get User Profile

**Endpoint:** `GET /api/user/profile`  
**Authentication:** Required (JWT)  
**Description:** Retrieve authenticated user's complete profile

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "role": "patient",
    "dateOfBirth": "1990-05-15",
    "address": "123 Main Street, Anytown, ST 12345",
    "insuranceId": "INS-2024-00123",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "profilePicture": "https://cloudinary.com/image.jpg",
    "verified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "statistics": {
      "totalClaims": 5,
      "approvedClaims": 3,
      "pendingClaims": 1,
      "rejectedClaims": 1,
      "totalClaimAmount": 25000,
      "approvedAmount": 18500
    }
  }
}
```

---

### 2.2 Update User Profile

**Endpoint:** `PUT /api/user/profile`  
**Authentication:** Required (JWT)  
**Description:** Update user profile information

**Request Body (Partial Update Allowed):**
```json
{
  "name": "John Updated Doe",
  "phone": "+1-555-9876",
  "address": "456 New Street, Newtown, ST 54321",
  "profilePicture": "base64_encoded_image_or_url"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Updated Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-9876",
    "address": "456 New Street, Newtown, ST 54321",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Note:** Email and role cannot be changed through this endpoint

---

## 3. Claims Management

### 3.1 Submit New Claim (Patient)

**Endpoint:** `POST /api/_claims/submit`  
**Authentication:** Required (JWT - Patient role)  
**Description:** Submit a new insurance claim with blockchain verification

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
patientName: John Doe
diagnosisCode: A01.0 (ICD-10 code)
treatmentCode: T85.71 (CPT code)
claimAmount: 5000
hospitalName: City General Hospital
hospitalAddress: 789 Medical Drive, Healthville
doctorName: Dr. Sarah Smith
doctorLicense: MD-12345
dateOfService: 2024-01-10
dateOfAdmission: 2024-01-10 (optional)
dateOfDischarge: 2024-01-12 (optional)
treatmentDescription: Emergency appendectomy surgery
isDuplicate: No
documents[]: file1.pdf (Medical reports)
documents[]: file2.pdf (Lab results)
documents[]: file3.jpg (X-rays)
```

**Processing Steps:**
1. Validate form data
2. Upload documents to Cloudinary/IPFS
3. Run ML fraud detection
4. Record transaction on blockchain
5. Save to database
6. Send confirmation email
7. Create activity log

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "claim": {
    "claimId": "CLM-2024-00123",
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "patientName": "John Doe",
    "claimAmount": 5000,
    "hospitalName": "City General Hospital",
    "documents": [
      {
        "name": "medical_report.pdf",
        "url": "https://cloudinary.com/v1/documents/abc123.pdf",
        "ipfsHash": "QmXYZ..."
      }
    ],
    "blockchainHash": "0xabc123def456...",
    "fraudScore": 0.05,
    "fraudRisk": "low",
    "estimatedProcessingDays": 5,
    "nextStep": "Under review by insurer"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Missing Required Fields
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "diagnosisCode",
      "message": "Diagnosis code is required"
    }
  ]
}

// 413 Payload Too Large - File Size Limit
{
  "success": false,
  "message": "File size exceeds maximum limit of 10MB"
}

// 503 Service Unavailable - Blockchain Error
{
  "success": false,
  "message": "Blockchain service temporarily unavailable. Claim saved but not verified."
}
```

---

### 3.2 Get Pending Claims

**Endpoint:** `GET /api/claims/pending`  
**Authentication:** Required (JWT - Insurer/Admin role)  
**Description:** Retrieve all claims pending review

**Query Parameters:**
```
page: 1 (default: 1)
limit: 10 (default: 10, max: 100)
sortBy: dateSubmitted | claimAmount | fraudScore
order: asc | desc (default: desc)
filterBy: fraudRisk (low|medium|high)
search: CLM-2024-00123 (search by claim ID)
```

**Example Request:**
```http
GET /api/claims/pending?page=1&limit=20&sortBy=fraudScore&order=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "claims": [
    {
      "claimId": "CLM-2024-00125",
      "patientName": "Jane Smith",
      "claimAmount": 8500,
      "dateSubmitted": "2024-01-15T09:00:00.000Z",
      "hospitalName": "Metro Hospital",
      "diagnosisCode": "J18.9",
      "fraudScore": 0.85,
      "fraudRisk": "high",
      "status": "pending",
      "daysPending": 2
    },
    {
      "claimId": "CLM-2024-00124",
      "patientName": "Bob Johnson",
      "claimAmount": 3200,
      "dateSubmitted": "2024-01-14T14:30:00.000Z",
      "hospitalName": "City Clinic",
      "diagnosisCode": "M54.5",
      "fraudScore": 0.12,
      "fraudRisk": "low",
      "status": "pending",
      "daysPending": 3
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalClaims": 47,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "summary": {
    "totalAmount": 453200,
    "averageFraudScore": 0.23,
    "highRiskClaims": 5,
    "mediumRiskClaims": 12,
    "lowRiskClaims": 30
  }
}
```

---

### 3.3 Validate Claim

**Endpoint:** `POST /api/claims/pending/validate/:claimId`  
**Authentication:** Required (JWT - Insurer/Admin role)  
**Description:** Run comprehensive validation on a pending claim

**Path Parameters:**
- `claimId`: Claim identifier (e.g., CLM-2024-00123)

**Request Body (Optional):**
```json
{
  "recheckFraud": true,
  "verifyDocuments": true,
  "checkDuplicates": true
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "claimId": "CLM-2024-00123",
  "validationResult": {
    "overall": "pass",
    "fraudDetection": {
      "isFraudulent": false,
      "fraudScore": 0.08,
      "riskLevel": "low",
      "factors": {
        "claimAmountNormal": true,
        "diagnosisTreatmentMatch": true,
        "noDuplicate": true,
        "hospitalVerified": true
      }
    },
    "documentVerification": {
      "allDocumentsValid": true,
      "documentsChecked": 3,
      "missingDocuments": [],
      "issues": []
    },
    "duplicateCheck": {
      "isDuplicate": false,
      "similarClaims": []
    },
    "blockchainVerification": {
      "verified": true,
      "transactionHash": "0xabc123...",
      "blockNumber": 12345678
    },
    "recommendedAction": "approve",
    "confidence": 0.95,
    "notes": "All validation checks passed successfully"
  }
}
```

---

### 3.4 Approve Claim

**Endpoint:** `POST /api/claims/approved/approve`  
**Authentication:** Required (JWT - Insurer/Admin role)  
**Description:** Approve a claim for payment processing

**Request Body:**
```json
{
  "claimId": "CLM-2024-00123",
  "approvedAmount": 4800,
  "adjustments": [
    {
      "type": "deductible",
      "amount": -200,
      "reason": "Annual deductible applied"
    }
  ],
  "approverNotes": "Claim verified. All documents in order. Standard deductible applied.",
  "paymentMethod": "bank_transfer",
  "estimatedPaymentDays": 3
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Claim approved successfully",
  "claim": {
    "claimId": "CLM-2024-00123",
    "status": "approved",
    "originalAmount": 5000,
    "approvedAmount": 4800,
    "adjustmentTotal": -200,
    "approvedBy": {
      "name": "Sarah Johnson",
      "id": "insurer_001",
      "role": "insurer"
    },
    "approvedAt": "2024-01-15T15:30:00.000Z",
    "paymentStatus": "processing",
    "estimatedPaymentDate": "2024-01-18T00:00:00.000Z",
    "blockchainUpdated": true,
    "notificationSent": true
  }
}
```

---

### 3.5 Get Rejected Claims

**Endpoint:** `GET /api/claims/rejected`  
**Authentication:** Required (JWT)  
**Description:** Retrieve all rejected claims (filtered by role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "claims": [
    {
      "claimId": "CLM-2024-00120",
      "patientName": "John Doe",
      "claimAmount": 7500,
      "dateSubmitted": "2024-01-10T10:00:00.000Z",
      "dateRejected": "2024-01-12T14:30:00.000Z",
      "rejectionReason": "Insufficient documentation - Missing lab reports",
      "canDispute": true,
      "disputeDeadline": "2024-02-12T23:59:59.000Z"
    }
  ]
}
```

---

### 3.6 File Claim Dispute

**Endpoint:** `POST /api/claims/dispute/:claimId`  
**Authentication:** Required (JWT - Patient role)  
**Description:** File a dispute for a rejected claim

**Request Body:**
```json
{
  "disputeReason": "All required documents were submitted. Please review again.",
  "additionalDocuments": ["file1.pdf", "file2.pdf"],
  "requestedAction": "reconsider"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Dispute filed successfully",
  "dispute": {
    "disputeId": "DSP-2024-00010",
    "claimId": "CLM-2024-00120",
    "status": "under_review",
    "filedAt": "2024-01-15T16:00:00.000Z",
    "estimatedResolutionDays": 7
  }
}
```

---

### 3.7 Get Claim Analytics

**Endpoint:** `GET /api/claims/analytics`  
**Authentication:** Required (JWT - Admin role)  
**Description:** Retrieve comprehensive claim analytics and statistics

**Query Parameters:**
```
startDate: 2024-01-01
endDate: 2024-01-31
groupBy: day | week | month
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "analytics": {
    "summary": {
      "totalClaims": 1250,
      "pendingClaims": 47,
      "approvedClaims": 980,
      "rejectedClaims": 223,
      "totalAmountClaimed": 12500000,
      "totalAmountApproved": 10200000,
      "totalAmountRejected": 2300000,
      "averageClaimAmount": 10000,
      "averageApprovedAmount": 10408,
      "approvalRate": 0.784,
      "rejectionRate": 0.178
    },
    "fraudDetection": {
      "totalFraudulentClaims": 45,
      "fraudDetectionRate": 0.036,
      "totalFraudPrevented": 450000,
      "averageFraudScore": 0.15
    },
    "processing": {
      "averageProcessingTimeDays": 5.2,
      "fastestProcessingDays": 1,
      "slowestProcessingDays": 14,
      "claimsProcessedToday": 23
    },
    "trends": [
      {
        "date": "2024-01-15",
        "claimsSubmitted": 45,
        "claimsApproved": 38,
        "claimsRejected": 7
      }
    ],
    "topDiagnoses": [
      {
        "code": "J18.9",
        "description": "Pneumonia",
        "count": 125,
        "totalAmount": 625000
      }
    ],
    "topHospitals": [
      {
        "name": "City General Hospital",
        "claimCount": 234,
        "totalAmount": 2340000,
        "approvalRate": 0.92
      }
    ]
  }
}
```

---

## 4. File Upload

Base Path: `/api`

### 4.1 Upload General File

**Endpoint:** `POST /api/upload`  
**Authentication:** Required (JWT)  
**Description:** Upload files to Cloudinary (images, PDFs, documents)

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary file data]
folder: medical_reports (optional)
tags: report,patient_123 (optional)
```

**File Constraints:**
- Max size: 10MB
- Allowed types: PDF, JPG, PNG, JPEG, DOCX
- Virus scanning enabled

**Success Response (200 OK):**
```json
{
  "success": true,
  "file": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1705315800/medical_reports/abc123.pdf",
    "publicId": "medical_reports/abc123",
    "format": "pdf",
    "bytes": 1048576,
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4.2 Upload Medical Report (IPFS)

**Endpoint:** `POST /api/upload-report`  
**Authentication:** Required (JWT)  
**Description:** Upload sensitive medical reports to decentralized IPFS storage

**Request Body:**
```
file: [binary file data]
encrypt: true (optional)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "ipfsHash": "QmXyZ123...",
    "url": "https://gateway.pinata.cloud/ipfs/QmXyZ123...",
    "encrypted": true,
    "size": 2048576,
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4.3 Get User Reports

**Endpoint:** `GET /api/reports`  
**Authentication:** Required (JWT)  
**Description:** Retrieve all uploaded reports for the authenticated user

**Success Response (200 OK):**
```json
{
  "success": true,
  "reports": [
    {
      "id": "report_001",
      "name": "Blood Test Results.pdf",
      "url": "https://gateway.pinata.cloud/ipfs/QmXyZ123...",
      "type": "lab_report",
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "size": 1048576
    }
  ]
}
```

---

## 5. Communication

### 5.1 Contact Form

**Endpoint:** `POST /api/contact/send`  
**Authentication:** Not required  
**Description:** Send message via contact form to admin

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about claims processing",
  "message": "I would like to know the average processing time for medical claims.",
  "phone": "+1-555-0123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We'll respond within 24-48 hours.",
  "ticketId": "TICKET-2024-00123"
}
```

---

### 5.2 AI Chatbot

**Endpoint:** `POST /api/chatbot/send`  
**Authentication:** Required (JWT)  
**Description:** Send message to AI chatbot for instant support

**Request Body:**
```json
{
  "message": "What is the status of my claim CLM-2024-00123?",
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "conversationId": "conv_12345" // Optional, for context
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "reply": "Your claim CLM-2024-00123 is currently under review by the insurance team. It was submitted on January 10, 2024, and the estimated processing time is 3-5 business days. You should expect a decision by January 17, 2024.",
  "conversationId": "conv_12345",
  "context": {
    "claimStatus": "pending",
    "lastUpdated": "2024-01-15T10:30:00.000Z",
    "estimatedResolution": "2024-01-17T00:00:00.000Z"
  },
  "suggestions": [
    "View claim details",
    "Upload additional documents",
    "Contact support"
  ]
}
```

---

## 6. Admin Operations

Base Path: `/api/users`  
**Role Required:** Admin

### 6.1 Get All Users

**Endpoint:** `GET /api/users`  
**Authentication:** Required (JWT - Admin)

**Query Parameters:**
```
role: patient | insurer | admin
status: active | suspended | deleted
page: 1
limit: 20
search: john@example.com
sortBy: createdAt | lastLogin | name
order: asc | desc
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "status": "active",
      "verified": true,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "statistics": {
        "totalClaims": 5,
        "totalSpent": 25000
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalUsers": 195
  }
}
```

---

### 6.2 Create User (Admin)

**Endpoint:** `POST /api/users`  
**Authentication:** Required (JWT - Admin)

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "TempPassword123!",
  "role": "insurer",
  "sendWelcomeEmail": true
}
```

---

### 6.3 Change User Role

**Endpoint:** `PUT /api/users/:userId/role`  
**Authentication:** Required (JWT - Admin)

**Request Body:**
```json
{
  "role": "insurer",
  "reason": "Promoted to insurer role due to job change"
}
```

---

### 6.4 Deactivate User

**Endpoint:** `PUT /api/users/:userId/deactivate`  
**Authentication:** Required (JWT - Admin)

**Request Body:**
```json
{
  "reason": "Suspicious activity detected",
  "duration": 30 // days, or null for permanent
}
```

---

### 6.5 Activity Logs

**Endpoint:** `GET /api/users/activity-log`  
**Authentication:** Required (JWT - Admin)

**Query Parameters:**
```
userId: user_001 (optional)
action: login | claim_submit | claim_approve
startDate: 2024-01-01
endDate: 2024-01-31
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_001",
      "userId": "user_001",
      "userName": "John Doe",
      "action": "claim_submit",
      "details": "Submitted claim CLM-2024-00123",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 7. Analytics & Reports

### 7.1 Generate Report

**Endpoint:** `POST /api/reports/generate`  
**Authentication:** Required (JWT - Admin/Insurer)

**Request Body:**
```json
{
  "reportType": "claims_summary",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "format": "pdf",
  "includeCharts": true
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "reportId": "RPT-2024-00123",
    "url": "https://cloudinary.com/reports/summary_jan2024.pdf",
    "generatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 7.2 Send Report via Email

**Endpoint:** `POST /api/reports/send-email`  
**Authentication:** Required (JWT - Admin)

**Request Body:**
```json
{
  "reportId": "RPT-2024-00123",
  "recipients": ["admin@example.com", "manager@example.com"],
  "subject": "Monthly Claims Report - January 2024",
  "message": "Please find attached the monthly claims summary report."
}
```

---

## 8. Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* Additional error context */ },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/claims/submit",
    "requestId": "req_abc123"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 413 | Payload Too Large | File size exceeds limit |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | External service unavailable |

### Common Error Codes

```javascript
// Authentication Errors
'AUTH_001': 'Invalid credentials'
'AUTH_002': 'Token expired'
'AUTH_003': 'Insufficient permissions'

// Validation Errors
'VAL_001': 'Missing required field'
'VAL_002': 'Invalid field format'
'VAL_003': 'Field value out of range'

// Resource Errors
'RES_001': 'Resource not found'
'RES_002': 'Resource already exists'
'RES_003': 'Resource conflict'

// Service Errors
'SVC_001': 'Blockchain service unavailable'
'SVC_002': 'AI service unavailable'
'SVC_003': 'File upload service unavailable'
```

---

## 🧪 Testing with Examples

### Using cURL

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecureP@ssw0rd",
    "role": "patient"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecureP@ssw0rd"
  }'

# Get profile (with token)
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection (if available)
2. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (set after login)
3. Use {{base_url}} and {{token}} in requests

---

## 📊 Rate Limits

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Contact Form | 5 requests | 15 minutes |
| File Upload | 20 requests | 1 hour |
| General API | 100 requests | 15 minutes |
| Admin Operations | 200 requests | 15 minutes |

---

## 🔒 Security Best Practices

1. **Always use HTTPS** in production
2. **Store JWT tokens securely** (HTTP-only cookies)
3. **Validate all inputs** on both client and server
4. **Use strong passwords** and enforce password policies
5. **Enable two-factor authentication** (if available)
6. **Monitor API usage** for suspicious activity
7. **Keep dependencies updated** to patch vulnerabilities

---

## 📚 Additional Resources

- [Postman Collection](#) (Coming soon)
- [OpenAPI/Swagger Documentation](#) (Coming soon)
- [SDK/Client Libraries](#) (Coming soon)
- [Webhooks Documentation](#) (Coming soon)

