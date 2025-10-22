# Frontend Documentation (React)

## 📋 Overview

The frontend is built with **React.js** and provides a modern, responsive user interface for patients, insurers, and administrators. It features role-based dashboards, real-time claim tracking, AI chatbot integration, and blockchain-powered authentication.

**Default Configuration:**
- **Port:** 3000
- **Start Command:** `npm start`
- **Base URL:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **Build Tool:** Create React App (CRA)
- **Styling:** Tailwind CSS + Custom CSS

---

## 🏗️ Architecture

### Directory Structure

```
frontend/
├── public/
│   ├── index.html            # Root HTML file
│   ├── manifest.json         # PWA configuration
│   └── assets/               # Static images and icons
├── src/
│   ├── App.js                # Main application component
│   ├── index.js              # Application entry point
│   ├── App.css               # Global styles
│   ├── index.css             # Tailwind directives
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.js         # Navigation bar
│   │   ├── Footer.js         # Footer component
│   │   ├── Dashboard/        # Dashboard components
│   │   │   ├── PatientDashboard.js
│   │   │   ├── InsurerDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── Claims/           # Claim-related components
│   │   │   ├── ClaimForm.js
│   │   │   ├── ClaimTracker.js
│   │   │   ├── ClaimHistory.js
│   │   │   └── ClaimDetails.js
│   │   ├── Auth/             # Authentication components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ForgotPassword.js
│   │   │   └── ResetPassword.js
│   │   ├── Profile/          # User profile components
│   │   │   ├── ProfileView.js
│   │   │   └── ProfileEdit.js
│   │   ├── Admin/            # Admin panel components
│   │   │   ├── UserManagement.js
│   │   │   ├── ClaimApproval.js
│   │   │   └── Analytics.js
│   │   ├── Chatbot/          # AI Chatbot
│   │   │   └── ChatbotWidget.js
│   │   ├── Insurance/        # Insurance plans
│   │   │   ├── PlanList.js
│   │   │   └── PlanDetails.js
│   │   └── Common/           # Shared components
│   │       ├── Button.js
│   │       ├── Card.js
│   │       ├── Modal.js
│   │       ├── Spinner.js
│   │       └── Alert.js
│   ├── assets/               # Images and media
│   └── setupTests.js         # Testing configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Dependencies and scripts
```

---

## 🎨 Component Architecture

### Component Hierarchy

```
App.js
├── Navbar
├── Router
│   ├── Home
│   ├── Auth
│   │   ├── Login
│   │   ├── Register
│   │   └── ForgotPassword
│   ├── Dashboard (Protected Route)
│   │   ├── PatientDashboard
│   │   │   ├── ClaimOverview
│   │   │   ├── RecentActivity
│   │   │   └── Notifications
│   │   ├── InsurerDashboard
│   │   │   ├── PendingClaims
│   │   │   ├── Analytics
│   │   │   └── ClaimReview
│   │   └── AdminDashboard
│   │       ├── UserManagement
│   │       ├── SystemAnalytics
│   │       └── AuditLogs
│   ├── Claims
│   │   ├── SubmitClaim
│   │   ├── ClaimTracker
│   │   └── ClaimHistory
│   ├── Profile
│   └── Insurance Plans
├── ChatbotWidget
└── Footer
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
User visits site
    ↓
Check localStorage for JWT token
    ↓
Token exists? → Validate token → Redirect to dashboard
    ↓
No token → Show Login/Register page
    ↓
User logs in (Email/Password or MetaMask)
    ↓
Backend validates credentials
    ↓
JWT token returned and stored
    ↓
User redirected to role-based dashboard
```

### MetaMask Integration

**Ethereum Wallet Authentication:**
```javascript
// Example: MetaMask login implementation
import { ethers } from 'ethers';

const loginWithMetaMask = async () => {
  try {
    // Request account access
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      // Sign a message to verify ownership
      const message = `Login to Healthcare System: ${Date.now()}`;
      const signature = await signer.signMessage(message);
      
      // Send to backend for verification
      const response = await fetch('http://localhost:5000/api/auth/metamask-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message })
      });
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert('Please install MetaMask!');
    }
  } catch (error) {
    console.error('MetaMask login failed:', error);
  }
};
```

### Protected Routes

```javascript
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 📱 Key Features & Components

### 1. Patient Dashboard

**Features:**
- View all submitted claims and their statuses
- Real-time claim tracking with progress indicators
- Upload medical documents
- View insurance policy details
- Personal health insights

**Implementation Example:**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchClaims();
  }, []);
  
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/claims/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClaims(response.data.claims);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching claims:', error);
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard-container">
      <h1>My Claims</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="claims-grid">
          {claims.map(claim => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 2. Claim Submission Form

**Features:**
- Multi-step form with validation
- File upload with drag-and-drop
- Real-time fraud detection preview
- Blockchain transaction confirmation

**Form Steps:**
1. Patient Information
2. Diagnosis & Treatment Details
3. Hospital & Provider Information
4. Document Upload
5. Review & Submit

**Implementation:**
```javascript
const ClaimForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: '',
    diagnosisCode: '',
    treatmentCode: '',
    claimAmount: '',
    hospitalName: '',
    dateOfService: '',
    documents: []
  });
  
  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          formData.documents.forEach(file => {
            formDataToSend.append('documents', file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/_claims/submit',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      alert('Claim submitted successfully!');
      // Redirect to claim tracker
      window.location.href = `/claim-tracker/${response.data.claim.claimId}`;
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Failed to submit claim. Please try again.');
    }
  };
  
  return (
    <div className="claim-form">
      {/* Multi-step form implementation */}
    </div>
  );
};
```

---

### 3. AI Chatbot Widget

**Features:**
- Real-time message streaming
- Context-aware responses
- Claim status lookup
- Medical information assistance
- 24/7 availability

**Implementation:**
```javascript
import { useState } from 'react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/chatbot/send',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add bot response
      const botMessage = { sender: 'bot', text: response.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
    }
  };
  
  return (
    <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="chat-toggle">
        💬 Chat with AI
      </button>
      
      {isOpen && (
        <div className="chat-window">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

### 4. Claim Tracker

**Features:**
- Visual progress timeline
- Blockchain verification display
- Document preview
- Status update notifications

**Status Timeline:**
```
Submitted → Under Review → Fraud Check → Approved/Rejected → Payment
```

**Implementation:**
```javascript
const ClaimTracker = ({ claimId }) => {
  const [claimData, setClaimData] = useState(null);
  
  useEffect(() => {
    fetchClaimStatus();
  }, [claimId]);
  
  const fetchClaimStatus = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `http://localhost:5000/api/claim-tracker/${claimId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setClaimData(response.data);
  };
  
  const statusSteps = [
    { status: 'submitted', label: 'Submitted', icon: '📝' },
    { status: 'reviewing', label: 'Under Review', icon: '🔍' },
    { status: 'fraud_check', label: 'Fraud Check', icon: '🛡️' },
    { status: 'approved', label: 'Approved', icon: '✅' },
    { status: 'payment', label: 'Payment Processed', icon: '💰' }
  ];
  
  return (
    <div className="claim-tracker">
      <h2>Claim ID: {claimId}</h2>
      <div className="timeline">
        {statusSteps.map((step, idx) => (
          <div
            key={idx}
            className={`step ${claimData?.status === step.status ? 'active' : ''}`}
          >
            <div className="icon">{step.icon}</div>
            <div className="label">{step.label}</div>
          </div>
        ))}
      </div>
      
      {claimData?.blockchainHash && (
        <div className="blockchain-verify">
          <h3>🔗 Blockchain Verified</h3>
          <p>Transaction Hash: {claimData.blockchainHash}</p>
          <a
            href={`https://etherscan.io/tx/${claimData.blockchainHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Blockchain
          </a>
        </div>
      )}
    </div>
  );
};
```

---

### 5. Admin Dashboard

**Features:**
- User management (create, edit, deactivate)
- Claim approval workflow
- System analytics and reports
- Audit logs
- Real-time statistics

**Key Metrics Displayed:**
- Total users (patients, insurers, admins)
- Total claims (pending, approved, rejected)
- Revenue statistics
- Fraud detection rate
- Average claim processing time

---

### 6. Insurer Dashboard

**Features:**
- Review pending claims
- Validate documents
- Approve/reject claims
- View claim analytics
- Generate reports

---

## 🎨 Styling & UI/UX

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#baddff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Animation with Framer Motion

```javascript
import { motion } from 'framer-motion';

const AnimatedCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    className="card"
  >
    {children}
  </motion.div>
);
```

---

## 🔧 Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# IPFS/Pinata (Optional - for client-side uploads)
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_API_KEY=your_pinata_secret_key

# Blockchain Configuration
REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
REACT_APP_CONTRACT_ADDRESS=0x...

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

---

## 🚀 Getting Started

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
# Add environment variables (see above)

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# The build folder contains optimized static files
# Deploy this folder to your hosting service
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 📦 Dependencies

### Core Libraries
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.12.0",
  "react-icons": "^4.10.0"
}
```

### HTTP & State Management
```json
{
  "axios": "^1.4.0",
  "react-query": "^3.39.0"
}
```

### Blockchain & Web3
```json
{
  "ethers": "^6.6.0",
  "web3": "^4.0.0"
}
```

### File Handling
```json
{
  "react-dropzone": "^14.2.0",
  "pinata-sdk": "^2.1.0"
}
```

### Forms & Validation
```json
{
  "formik": "^2.4.0",
  "yup": "^1.2.0"
}
```

---

## 🌐 Routing Structure

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/insurance-plans" element={<InsurancePlans />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/submit-claim" element={
          <ProtectedRoute><ClaimForm /></ProtectedRoute>
        } />
        <Route path="/claim-tracker/:claimId" element={
          <ProtectedRoute><ClaimTracker /></ProtectedRoute>
        } />
        <Route path="/claim-history" element={
          <ProtectedRoute><ClaimHistory /></ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔍 State Management

### Using React Context (Simple State)

```javascript
// contexts/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);
  
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**Usage:**
```javascript
import { useAuth } from './contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy with Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
{
  "homepage": "https://yourusername.github.io/healthcare-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

# Deploy
npm run deploy
```

---

## 🧪 Testing Best Practices

### Component Testing Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('submits login form', async () => {
  render(<Login />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Assert API call was made
});
```

---

## 🔧 Troubleshooting

### Common Issues

**CORS Errors**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked
```
**Solution:** Ensure backend has CORS enabled for `http://localhost:3000`

**MetaMask Not Detected**
```
window.ethereum is undefined
```
**Solution:** Install MetaMask extension and reload page

**Build Errors**
```
Module not found: Can't resolve 'xyz'
```
**Solution:** Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Performance Optimization

- **Code Splitting:** Use React.lazy() for route-based splitting
- **Image Optimization:** Use WebP format and lazy loading
- **Memoization:** Use React.memo() and useMemo() for expensive computations
- **Bundle Analysis:** Run `npm run build` and analyze bundle size

```bash
# Analyze bundle size
npm install --save-dev source-map-explorer
npm run build
source-map-explorer 'build/static/js/*.js'
```

---

## 🎯 Best Practices

1. **Component Organization:** Keep components small and focused
2. **Error Handling:** Always use try-catch for async operations
3. **Loading States:** Show spinners during data fetching
4. **Form Validation:** Validate on both frontend and backend
5. **Accessibility:** Use semantic HTML and ARIA labels
6. **Responsive Design:** Mobile-first approach with Tailwind
7. **Security:** Never store sensitive data in localStorage
8. **Code Quality:** Use ESLint and Prettier for consistency

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Axios Documentation](https://axios-http.com/docs/intro)
