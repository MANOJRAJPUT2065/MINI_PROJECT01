# Security & Troubleshooting Documentation

## 🔒 Security Overview

The healthcare system implements multiple layers of security to protect sensitive medical data, ensure user privacy, and maintain system integrity. This document outlines the comprehensive security measures, best practices, and troubleshooting procedures.

## 🛡️ Security Architecture

### Multi-Layer Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Security                        │
├─────────────────────────────────────────────────────────────┤
│  • Input Validation  • XSS Protection  • CSRF Protection   │
│  • Content Security Policy  • Secure Headers               │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Network Security                         │
├─────────────────────────────────────────────────────────────┤
│  • HTTPS/TLS 1.3  • Rate Limiting  • DDoS Protection      │
│  • Firewall Rules  • VPN Access  • IP Whitelisting         │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Application Security                     │
├─────────────────────────────────────────────────────────────┤
│  • JWT Authentication  • Role-based Access Control         │
│  • API Security  • Input Sanitization  • SQL Injection    │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Data Security                            │
├─────────────────────────────────────────────────────────────┤
│  • Encryption at Rest  • Encryption in Transit             │
│  • Database Security  • Backup Encryption                  │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Security                      │
├─────────────────────────────────────────────────────────────┤
│  • Smart Contract Audits  • Private Key Management         │
│  • Multi-signature Wallets  • Immutable Audit Trail        │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization

### JWT Token Security

#### Token Configuration
```javascript
// JWT Configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET, // 256-bit secret key
  expiresIn: '7d',                // Token expiration
  issuer: 'healthcare-system',    // Token issuer
  audience: 'healthcare-users',   // Token audience
  algorithm: 'HS256'              // Hashing algorithm
};
```

#### Token Lifecycle Management
- **Token Generation**: Secure random secret with high entropy
- **Token Validation**: Signature verification on every request
- **Token Refresh**: Automatic token refresh before expiration
- **Token Revocation**: Blacklist mechanism for compromised tokens

#### Security Features
```javascript
// Token validation middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};
```

### Role-Based Access Control (RBAC)

#### User Roles and Permissions
```javascript
const rolePermissions = {
  patient: [
    'view_own_profile',
    'update_own_profile',
    'submit_claims',
    'view_own_claims',
    'upload_documents'
  ],
  doctor: [
    'view_patient_profiles',
    'submit_claims',
    'review_claims',
    'update_medical_records',
    'view_medical_history'
  ],
  insurer: [
    'view_all_claims',
    'approve_claims',
    'reject_claims',
    'view_analytics',
    'manage_policies'
  ],
  admin: [
    'manage_users',
    'view_system_logs',
    'configure_system',
    'manage_doctors',
    'view_audit_trails'
  ]
};
```

#### Permission Middleware
```javascript
const requirePermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = rolePermissions[userRole] || [];
    
    if (!permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};
```

## 🔒 Data Encryption

### Encryption at Rest

#### Database Encryption
```javascript
// MongoDB encryption configuration
const encryptionConfig = {
  keyVaultNamespace: 'encryption.__keyVault',
  kmsProviders: {
    local: {
      key: Buffer.from(process.env.ENCRYPTION_KEY, 'base64')
    }
  },
  schemaMap: {
    'healthcare.patients': {
      bsonType: 'object',
      encryptMetadata: {
        keyId: '/key-id',
        algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
      },
      properties: {
        ssn: {
          encrypt: {
            bsonType: 'string',
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
          }
        },
        medicalHistory: {
          encrypt: {
            bsonType: 'array',
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
          }
        }
      }
    }
  }
};
```

#### File Encryption
```javascript
// File encryption utility
const crypto = require('crypto');

class FileEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(process.env.FILE_ENCRYPTION_KEY, 'salt', 32);
  }
  
  encryptFile(buffer) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('healthcare-file', 'utf8'));
    
    let encrypted = cipher.update(buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted,
      iv: iv,
      authTag: authTag
    };
  }
  
  decryptFile(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('healthcare-file', 'utf8'));
    decipher.setAuthTag(encryptedData.authTag);
    
    let decrypted = decipher.update(encryptedData.encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted;
  }
}
```

### Encryption in Transit

#### HTTPS Configuration
```javascript
// Express HTTPS configuration
const https = require('https');
const fs = require('fs');

const httpsOptions = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  ca: fs.readFileSync('path/to/ca-bundle.pem'),
  ciphers: [
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES128-SHA256'
  ].join(':'),
  honorCipherOrder: true,
  secureProtocol: 'TLSv1_2_method'
};

const server = https.createServer(httpsOptions, app);
```

#### API Security Headers
```javascript
// Security headers middleware
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}));
```

## 🛡️ Input Validation & Sanitization

### Request Validation
```javascript
const { body, validationResult } = require('express-validator');

// Input validation rules
const validateClaimSubmission = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Amount must be between 0 and 100,000'),
  
  body('diagnosis')
    .isLength({ min: 1, max: 500 })
    .withMessage('Diagnosis must be between 1 and 500 characters')
    .escape()
    .trim(),
  
  body('treatment')
    .isLength({ min: 1, max: 500 })
    .withMessage('Treatment must be between 1 and 500 characters')
    .escape()
    .trim(),
  
  body('patientId')
    .isMongoId()
    .withMessage('Invalid patient ID format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
```

### SQL Injection Prevention
```javascript
// Parameterized queries (using Mongoose)
const getPatientClaims = async (patientId) => {
  try {
    // Using Mongoose ODM prevents SQL injection
    const claims = await Claim.find({ 
      patient: mongoose.Types.ObjectId(patientId) 
    }).populate('doctor', 'name specialization');
    
    return claims;
  } catch (error) {
    throw new Error('Database query failed');
  }
};
```

### XSS Protection
```javascript
// XSS protection middleware
const xss = require('xss');

const xssOptions = {
  whiteList: {
    p: [],
    br: [],
    strong: [],
    em: []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
};

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key], xssOptions);
      }
    }
  }
  next();
};
```

## 🚦 Rate Limiting & DDoS Protection

### Rate Limiting Configuration
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  skipSuccessfulRequests: true
});

// File upload rate limiting
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 uploads per minute
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.'
  }
});
```

### DDoS Protection
```javascript
// DDoS protection middleware
const ddosProtection = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Simple rate limiting per IP
  if (!rateLimitStore[clientIP]) {
    rateLimitStore[clientIP] = { count: 0, resetTime: now + 60000 };
  }
  
  if (now > rateLimitStore[clientIP].resetTime) {
    rateLimitStore[clientIP] = { count: 0, resetTime: now + 60000 };
  }
  
  rateLimitStore[clientIP].count++;
  
  if (rateLimitStore[clientIP].count > 100) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded'
    });
  }
  
  next();
};
```

## 🔍 Audit Logging & Monitoring

### Comprehensive Audit Trail
```javascript
// Audit logging middleware
const auditLogger = (action, resource, details = {}) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response
      const auditLog = {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous',
        userRole: req.user?.role || 'guest',
        action: action,
        resource: resource,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.id,
        statusCode: res.statusCode,
        details: details,
        success: res.statusCode < 400
      };
      
      // Save to audit collection
      AuditLog.create(auditLog).catch(console.error);
      
      originalSend.call(this, data);
    };
    
    next();
  };
};
```

### Security Monitoring
```javascript
// Security monitoring service
class SecurityMonitor {
  constructor() {
    this.suspiciousActivities = new Map();
    this.alertThresholds = {
      failedLogins: 5,
      suspiciousRequests: 10,
      dataAccess: 100
    };
  }
  
  logActivity(userId, activity, metadata = {}) {
    const key = `${userId}_${activity}`;
    const now = Date.now();
    
    if (!this.suspiciousActivities.has(key)) {
      this.suspiciousActivities.set(key, []);
    }
    
    const activities = this.suspiciousActivities.get(key);
    activities.push({ timestamp: now, metadata });
    
    // Clean old activities (older than 1 hour)
    const oneHourAgo = now - 3600000;
    const recentActivities = activities.filter(a => a.timestamp > oneHourAgo);
    this.suspiciousActivities.set(key, recentActivities);
    
    // Check for suspicious patterns
    this.checkSuspiciousActivity(userId, activity, recentActivities);
  }
  
  checkSuspiciousActivity(userId, activity, activities) {
    const threshold = this.alertThresholds[activity] || 10;
    
    if (activities.length >= threshold) {
      this.sendSecurityAlert(userId, activity, activities.length);
    }
  }
  
  sendSecurityAlert(userId, activity, count) {
    console.warn(`SECURITY ALERT: User ${userId} has ${count} ${activity} activities`);
    // Send alert to security team
    // Implement notification system
  }
}
```

## 🔐 Blockchain Security

### Smart Contract Security
```solidity
// Security patterns in smart contracts
contract SecureInsuranceClaim {
    // Reentrancy protection
    bool private locked;
    
    modifier noReentrancy() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    // Access control
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Unauthorized access");
        _;
    }
    
    // Input validation
    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= MAX_CLAIM_AMOUNT, "Amount exceeds maximum");
        _;
    }
    
    // Emergency pause
    bool public paused = false;
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }
    
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
```

### Private Key Management
```javascript
// Secure private key handling
class KeyManager {
  constructor() {
    this.encryptedKeys = new Map();
  }
  
  generateKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.KEY_PASSPHRASE
      }
    });
    
    return keyPair;
  }
  
  encryptPrivateKey(privateKey, password) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  decryptPrivateKey(encryptedKey, password) {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

## 🚨 Incident Response

### Security Incident Response Plan

#### 1. Detection and Analysis
```javascript
// Automated threat detection
class ThreatDetector {
  detectThreats(req, res, next) {
    const threats = [];
    
    // Check for SQL injection patterns
    if (this.checkSQLInjection(req)) {
      threats.push('SQL_INJECTION_ATTEMPT');
    }
    
    // Check for XSS patterns
    if (this.checkXSS(req)) {
      threats.push('XSS_ATTEMPT');
    }
    
    // Check for suspicious user agents
    if (this.checkSuspiciousUserAgent(req)) {
      threats.push('SUSPICIOUS_USER_AGENT');
    }
    
    if (threats.length > 0) {
      this.handleThreats(threats, req);
      return res.status(403).json({
        success: false,
        message: 'Security threat detected'
      });
    }
    
    next();
  }
  
  handleThreats(threats, req) {
    console.warn(`Security threats detected: ${threats.join(', ')}`);
    console.warn(`IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    
    // Log to security monitoring system
    // Implement automated response (IP blocking, etc.)
  }
}
```

#### 2. Containment and Eradication
```javascript
// Emergency response procedures
class EmergencyResponse {
  async handleSecurityIncident(incidentType, severity, details) {
    switch (severity) {
      case 'CRITICAL':
        await this.activateEmergencyProtocol();
        break;
      case 'HIGH':
        await this.implementImmediateMeasures();
        break;
      case 'MEDIUM':
        await this.scheduleResponse();
        break;
      case 'LOW':
        await this.logAndMonitor();
        break;
    }
  }
  
  async activateEmergencyProtocol() {
    // Pause all non-essential services
    // Block suspicious IPs
    // Notify security team
    // Activate backup systems
  }
}
```

#### 3. Recovery and Lessons Learned
```javascript
// Post-incident analysis
class IncidentAnalysis {
  generateIncidentReport(incidentId) {
    return {
      incidentId,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      affectedSystems: ['API', 'Database'],
      rootCause: 'SQL Injection vulnerability',
      impact: 'Data breach of patient records',
      responseTime: '15 minutes',
      resolutionTime: '2 hours',
      lessonsLearned: [
        'Implement stricter input validation',
        'Add additional monitoring',
        'Update security training'
      ],
      recommendations: [
        'Deploy WAF',
        'Implement database encryption',
        'Conduct security audit'
      ]
    };
  }
}
```

## 🔧 Troubleshooting Guide

### Common Security Issues

#### 1. JWT Token Issues
```bash
# Problem: "Invalid token" errors
# Solution: Check token expiration and secret key

# Debug JWT issues
const jwt = require('jsonwebtoken');

function debugJWT(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    console.log('Token header:', decoded.header);
    console.log('Token payload:', decoded.payload);
    console.log('Token expiration:', new Date(decoded.payload.exp * 1000));
  } catch (error) {
    console.error('JWT decode error:', error.message);
  }
}
```

#### 2. Database Connection Issues
```bash
# Problem: MongoDB connection failures
# Solution: Check connection string and network access

# Test database connection
const mongoose = require('mongoose');

async function testDatabaseConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}
```

#### 3. Rate Limiting Issues
```bash
# Problem: Legitimate users getting rate limited
# Solution: Adjust rate limiting parameters

# Monitor rate limiting
const rateLimitMonitor = {
  trackRequests: (ip) => {
    // Implement request tracking
  },
  adjustLimits: (ip, currentLimit) => {
    // Dynamically adjust limits based on user behavior
  }
};
```

### Security Checklist

#### Pre-deployment Security Checklist
- [ ] All environment variables secured
- [ ] HTTPS enabled with valid certificates
- [ ] Database encryption configured
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] Audit logging enabled
- [ ] Error handling secure
- [ ] Dependencies updated
- [ ] Security tests passing

#### Post-deployment Security Checklist
- [ ] Monitor security logs
- [ ] Check for suspicious activities
- [ ] Verify backup integrity
- [ ] Test incident response procedures
- [ ] Review access controls
- [ ] Update security documentation
- [ ] Conduct security training
- [ ] Perform vulnerability scans

## 📞 Emergency Contacts

### Security Team Contacts
- **Security Lead**: security@healthcaresystem.com
- **Incident Response**: incident@healthcaresystem.com
- **Emergency Hotline**: +1-800-SECURITY

### Escalation Procedures
1. **Level 1**: Automated monitoring and alerts
2. **Level 2**: Security team notification
3. **Level 3**: Management escalation
4. **Level 4**: External security consultant

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [HIPAA Security Guidelines](https://www.hhs.gov/hipaa/for-professionals/security/index.html)

### Tools
- **Vulnerability Scanners**: OWASP ZAP, Nessus
- **Code Analysis**: SonarQube, ESLint Security
- **Monitoring**: ELK Stack, Prometheus
- **Encryption**: OpenSSL, Node.js crypto module
