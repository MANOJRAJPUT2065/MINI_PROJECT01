# Security & Troubleshooting Guide

## 🔐 Security Overview

Security is paramount in healthcare systems that handle sensitive medical data, insurance claims, and financial transactions. This guide covers comprehensive security practices, common vulnerabilities, and mitigation strategies for the Healthcare System.

**Security Pillars:**
1. **Authentication & Authorization** - Who can access what
2. **Data Encryption** - Protecting data at rest and in transit
3. **API Security** - Rate limiting, validation, CORS
4. **Blockchain Security** - Smart contract security
5. **Compliance** - HIPAA, GDPR, data protection laws
6. **Incident Response** - Handling security breaches

---

## 🔒 1. Authentication & Authorization

### JWT (JSON Web Tokens)

**Current Implementation:**
```javascript
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
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
            message: 'Invalid or expired token' 
        });
    }
};
```

**Security Best Practices:**

✅ **DO:**
- Use strong, randomly generated JWT_SECRET (min 32 characters)
- Set appropriate token expiration (e.g., 24 hours)
- Include user role and ID in token payload
- Validate tokens on every protected route
- Use HTTPS in production to prevent token interception
- Store tokens in HTTP-only cookies (more secure than localStorage)

❌ **DON'T:**
- Use predictable or weak secrets
- Store sensitive data in tokens (PII, passwords)
- Set very long expiration times (> 7 days)
- Store tokens in localStorage without encryption
- Transmit tokens in URL parameters

**Generate Strong JWT Secret:**
```bash
# Generate cryptographically secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 64
```

**Enhanced JWT Configuration:**
```javascript
// Sign token with additional options
const token = jwt.sign(
    { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
    },
    process.env.JWT_SECRET,
    { 
        expiresIn: '24h',
        issuer: 'healthcare-system',
        audience: 'healthcare-api'
    }
);
```

---

### Role-Based Access Control (RBAC)

**Implementation:**
```javascript
// middleware/roleMiddleware.js
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access forbidden. Insufficient permissions.'
            });
        }
        next();
    };
};

// Usage in routes
router.get('/admin/users', 
    verifyToken, 
    checkRole(['admin']), 
    adminController.getUsers
);

router.post('/claims/approve', 
    verifyToken, 
    checkRole(['admin', 'insurer']), 
    claimsController.approveClaim
);
```

**Role Hierarchy:**
```
Admin (Full Access)
├── User Management
├── Claim Approval/Rejection
├── System Configuration
├── Analytics & Reports
└── Audit Logs

Insurer
├── Review Claims
├── Validate Documents
├── Approve/Reject Claims
└── View Analytics

Doctor
├── Verify Claims
├── Upload Medical Reports
└── View Assigned Claims

Patient
├── Submit Claims
├── Upload Documents
├── Track Claims
└── View Personal Data
```

---

### Password Security

**Hashing with bcrypt:**
```javascript
const bcrypt = require('bcryptjs');

// Hash password (registration)
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Cost factor
    return await bcrypt.hash(password, salt);
};

// Verify password (login)
const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
```

**Password Requirements:**
```javascript
const passwordValidation = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Validation function
const validatePassword = (password) => {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
        return { valid: false, message: 'Password must contain lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        return { valid: false, message: 'Password must contain uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
        return { valid: false, message: 'Password must contain a number' };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return { valid: false, message: 'Password must contain special character' };
    }
    return { valid: true };
};
```

**Account Lockout (Brute Force Protection):**
```javascript
const loginAttempts = new Map(); // userId -> { count, lockedUntil }

const checkLoginAttempts = (userId) => {
    const attempts = loginAttempts.get(userId);
    
    if (attempts && attempts.lockedUntil > Date.now()) {
        const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
        throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
    }
    
    return true;
};

const recordFailedLogin = (userId) => {
    const attempts = loginAttempts.get(userId) || { count: 0 };
    attempts.count++;
    
    if (attempts.count >= 5) {
        attempts.lockedUntil = Date.now() + (60 * 60 * 1000); // 1 hour lockout
    }
    
    loginAttempts.set(userId, attempts);
};

const resetLoginAttempts = (userId) => {
    loginAttempts.delete(userId);
};
```

---

## 🔐 2. Data Encryption

### Encryption at Rest

**Encrypt Sensitive Database Fields:**
```javascript
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Usage in models
const userSchema = new mongoose.Schema({
    email: String,
    ssn: String, // Sensitive
    medicalRecords: String // Sensitive
});

userSchema.pre('save', function(next) {
    if (this.isModified('ssn')) {
        this.ssn = encrypt(this.ssn);
    }
    if (this.isModified('medicalRecords')) {
        this.medicalRecords = encrypt(this.medicalRecords);
    }
    next();
});
```

**MongoDB Encryption:**
```javascript
// Enable MongoDB encryption at rest (Atlas)
// Or use field-level encryption with mongocryptd
```

---

### Encryption in Transit (HTTPS/TLS)

**Force HTTPS in Production:**
```javascript
// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

// HTTPS server (production)
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync('path/to/private-key.pem'),
        cert: fs.readFileSync('path/to/certificate.pem')
    };
    
    https.createServer(options, app).listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
} else {
    app.listen(5000, () => {
        console.log('HTTP Server running on port 5000');
    });
}
```

**Obtain SSL Certificate:**
```bash
# Free SSL with Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com

# Or use Cloudflare, AWS Certificate Manager, etc.
```

---

## 🛡️ 3. API Security

### CORS (Cross-Origin Resource Sharing)

**Secure CORS Configuration:**
```javascript
const cors = require('cors');

// Development
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200
};

// Production - Strict origin
const corsOptionsProd = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://yourdomain.com',
            'https://www.yourdomain.com'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(process.env.NODE_ENV === 'production' ? corsOptionsProd : corsOptions));
```

---

### Rate Limiting

**Prevent DDoS and Brute Force:**
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limit for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: 'Too many login attempts. Please try again in 1 hour.',
    skipSuccessfulRequests: true // Don't count successful logins
});

// Email endpoint limiter
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many emails sent. Please try again later.'
});

// Apply to routes
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/contact/send', emailLimiter);
```

---

### Input Validation & Sanitization

**Prevent SQL Injection, XSS, and other attacks:**
```javascript
const { body, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Sanitize data
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Validation example
router.post('/claims/submit', [
    body('patientName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Invalid patient name'),
    body('claimAmount')
        .isFloat({ min: 0, max: 1000000 })
        .withMessage('Invalid claim amount'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email'),
    body('diagnosisCode')
        .matches(/^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/)
        .withMessage('Invalid ICD-10 code')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // Process validated data
});
```

---

### Security Headers

**Use Helmet.js:**
```javascript
const helmet = require('helmet');

app.use(helmet());

// Or configure individually
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

---

## ⛓️ 4. Blockchain Security

### Smart Contract Security

**Access Control:**
```solidity
// Always use modifiers
modifier onlyAdmin() {
    require(msg.sender == admin, "Not authorized");
    _;
}

// Don't use tx.origin (vulnerable to phishing)
// Use msg.sender instead
```

**Reentrancy Protection:**
```solidity
// Use checks-effects-interactions pattern
function payClaim(uint256 claimId) public onlyAdmin {
    Claim storage claim = claims[claimId];
    
    // 1. Checks
    require(claim.status == ClaimStatus.Approved, "Not approved");
    require(claim.amount <= address(this).balance, "Insufficient balance");
    
    // 2. Effects (update state BEFORE external call)
    claim.status = ClaimStatus.Paid;
    
    // 3. Interactions (external call LAST)
    payable(claim.claimant).transfer(claim.amount);
}
```

**Integer Overflow/Underflow:**
```solidity
// Solidity 0.8+ has built-in overflow protection
// For older versions, use SafeMath
```

**Private Key Management:**
```bash
# NEVER commit private keys
# Add to .gitignore
echo ".env" >> .gitignore
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore

# Use hardware wallets for production
# Use environment variables for deployment
```

---

## 📋 5. HIPAA Compliance

**Health Insurance Portability and Accountability Act (HIPAA) Requirements:**

### Protected Health Information (PHI)

**Encrypt all PHI:**
- Patient names, addresses, dates of birth
- Social Security numbers
- Medical record numbers
- Health insurance numbers
- Medical diagnoses and treatments
- Test results

**Access Controls:**
```javascript
// Log all PHI access
const logPHIAccess = async (userId, patientId, action) => {
    await AuditLog.create({
        userId,
        patientId,
        action, // 'view', 'update', 'delete'
        timestamp: new Date(),
        ipAddress: req.ip
    });
};

// Minimum necessary rule - only access what's needed
const getPatientData = async (userId, patientId, fields) => {
    await logPHIAccess(userId, patientId, 'view');
    
    return await Patient.findById(patientId).select(fields.join(' '));
};
```

**Data Retention:**
```javascript
// Automatic data deletion after retention period
const deleteOldRecords = async () => {
    const retentionPeriod = 7 * 365; // 7 years
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);
    
    await Claim.deleteMany({
        createdAt: { $lt: cutoffDate },
        status: 'Paid'
    });
};

// Run monthly
cron.schedule('0 0 1 * *', deleteOldRecords);
```

---

## 🚨 6. Incident Response

### Security Breach Protocol

**1. Detection:**
```javascript
// Monitor for suspicious activity
const detectSuspiciousActivity = (req) => {
    const indicators = [];
    
    // Multiple failed login attempts
    if (loginAttempts.get(req.user?.id)?.count > 3) {
        indicators.push('Multiple failed logins');
    }
    
    // Unusual access patterns
    if (req.user?.role === 'patient' && req.path.includes('/admin/')) {
        indicators.push('Unauthorized access attempt');
    }
    
    // High volume requests
    if (requestCounts.get(req.ip) > 1000) {
        indicators.push('Potential DDoS attack');
    }
    
    if (indicators.length > 0) {
        alertSecurityTeam(indicators, req);
    }
};
```

**2. Containment:**
```javascript
// Immediately block suspicious IP
const blockIP = (ipAddress) => {
    blockedIPs.add(ipAddress);
    
    // Update firewall rules
    exec(`iptables -A INPUT -s ${ipAddress} -j DROP`);
};

// Revoke all tokens
const revokeAllTokens = async (userId) => {
    await TokenBlacklist.create({ userId, revokedAt: new Date() });
};
```

**3. Investigation:**
- Review audit logs
- Identify compromised accounts
- Assess data breach scope
- Preserve evidence

**4. Recovery:**
- Patch vulnerabilities
- Reset passwords
- Restore from backups if needed
- Update security measures

**5. Notification:**
- Notify affected users within 72 hours (GDPR)
- Report to authorities if required
- Document incident

---

## 🔧 Troubleshooting

### Backend Issues

#### 1. MongoDB Connection Errors
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Verify connection string
echo $MONGO_URI

# Test connection
mongosh "mongodb://localhost:27017/healthcare"

# Check firewall
sudo ufw allow 27017
```

---

#### 2. JWT Token Errors
```
Error: jwt malformed
Error: jwt expired
```

**Solutions:**
```javascript
// Verify JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined in .env');
}

// Check token format
const token = req.headers.authorization?.split(' ')[1];
console.log('Token:', token);

// Decode without verification (debugging only)
const decoded = jwt.decode(token);
console.log('Decoded:', decoded);
```

---

#### 3. Email Sending Failures
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions:**
```javascript
// For Gmail:
// 1. Enable 2-Factor Authentication
// 2. Generate App Password (not regular password)
// 3. Use App Password in EMAIL_PASS

// Test email configuration
const testEmail = async () => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Test Email',
        text: 'If you receive this, email is configured correctly.'
    });
};
```

---

#### 4. File Upload Issues
```
Error: Unexpected field
Error: File too large
```

**Solutions:**
```javascript
// Check multer configuration
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Ensure form field names match
// Frontend: <input name="documents" />
// Backend: upload.array('documents', 5)
```

---

### Frontend Issues

#### 1. CORS Errors
```
Access-Control-Allow-Origin header is missing
```

**Solutions:**
```javascript
// Backend: Ensure CORS is configured
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Frontend: Include credentials
fetch('http://localhost:5000/api/data', {
    credentials: 'include'
});
```

---

#### 2. MetaMask Not Detected
```
window.ethereum is undefined
```

**Solutions:**
```javascript
if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask: https://metamask.io/download');
    return;
}

// Check if MetaMask is locked
const accounts = await window.ethereum.request({ 
    method: 'eth_accounts' 
});

if (accounts.length === 0) {
    // Request account access
    await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
    });
}
```

---

### Blockchain Issues

#### 1. Contract Deployment Fails
```
Error: insufficient funds for gas
```

**Solutions:**
```bash
# Check account balance
npx hardhat run scripts/checkBalance.js

# Fund account from Ganache
# Or get testnet ETH from faucet

# Reduce gas price
const tx = await contract.deploy({ gasPrice: ethers.utils.parseUnits('20', 'gwei') });
```

---

#### 2. Transaction Reverted
```
Error: transaction reverted without a reason string
```

**Solutions:**
```javascript
// Add more descriptive error messages in contracts
require(condition, "Detailed error message here");

// Enable debug mode in Hardhat
hardhat: {
    chainId: 1337,
    loggingEnabled: true
}

// Check transaction receipt
const receipt = await tx.wait();
console.log('Receipt:', receipt);
```

---

### Python Service Issues

#### 1. Model File Not Found
```
FileNotFoundError: model/fraud_detection_model.pkl
```

**Solutions:**
```bash
# Train the model
cd python
python train_model.py

# Check model path
ls -la model/

# Update path in app.py if needed
MODEL_PATH = 'model/fraud_detection_model.pkl'
```

---

#### 2. Port Already in Use
```
OSError: [Errno 48] Address already in use
```

**Solutions:**
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change port in app.py
app.run(host='0.0.0.0', port=5002)
```

---

## ✅ Security Checklist

### Pre-Deployment

- [ ] All secrets moved to environment variables
- [ ] .env added to .gitignore
- [ ] Strong JWT_SECRET generated
- [ ] Password requirements enforced
- [ ] HTTPS/TLS certificates obtained
- [ ] CORS properly configured for production domain
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Helmet.js security headers enabled
- [ ] Database encryption configured
- [ ] Smart contracts audited
- [ ] Private keys stored securely (hardware wallet/vault)
- [ ] Backup and disaster recovery plan
- [ ] HIPAA compliance checklist completed
- [ ] Penetration testing performed
- [ ] Security monitoring configured

### Post-Deployment

- [ ] Monitor logs for suspicious activity
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Rotate secrets regularly
- [ ] Review access logs
- [ ] Test backup restoration
- [ ] Incident response plan documented
- [ ] Team security training completed

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/index.html)
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/)
- [Web3 Security](https://blog.openzeppelin.com/security-audits/)

---

## 🆘 Emergency Contacts

```
Security Team: security@yourdomain.com
On-Call Engineer: +1-XXX-XXX-XXXX
Incident Hotline: +1-XXX-XXX-XXXX
```
