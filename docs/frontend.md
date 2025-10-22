# 🎨 Frontend Architecture & Development Guide

The frontend is a modern React.js single-page application that provides an intuitive, responsive, and feature-rich user interface for all healthcare platform stakeholders.

## 🚀 Quick Start

**Default Configuration:**
- **Framework:** React.js (v18+)
- **Port:** 3000 (configurable via `PORT` environment variable)
- **Build Tool:** Create React App with custom configurations
- **Start Command:** `npm start` (development with hot reload)
- **API Endpoint:** `http://localhost:5000` (configurable)

```bash
cd frontend
npm install
npm start
```

---

## 🏗️ Architecture Overview

### Core Technologies Stack
- **Framework:** React.js (v18+) with Hooks and Context API
- **Styling:** Tailwind CSS for utility-first styling
- **Animations:** Framer Motion for smooth transitions
- **Routing:** React Router DOM (v6+) for client-side navigation
- **State Management:** React Context + useReducer for global state
- **HTTP Client:** Axios for API communication
- **Blockchain:** Web3.js for Ethereum integration
- **Forms:** React Hook Form for form management
- **Charts:** Chart.js/Recharts for data visualization
- **Icons:** React Icons for consistent iconography

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   ├── forms/           # Form components
│   ├── charts/          # Data visualization components
│   └── layout/          # Layout components (Header, Sidebar)
├── pages/               # Page-level components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── claims/         # Claims management pages
│   └── profile/        # User profile pages
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── services/            # API service functions
├── utils/               # Utility functions
├── assets/              # Static assets (images, icons)
└── styles/              # Global styles and Tailwind config
```

---

## 🔧 Environment Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000

# Blockchain Configuration
REACT_APP_NETWORK_ID=1337  # Ganache local network
REACT_APP_CONTRACT_ADDRESS=0x...  # Deployed contract address

# IPFS Configuration (Optional)
REACT_APP_PINATA_API_KEY=your-pinata-api-key
REACT_APP_PINATA_SECRET_API_KEY=your-pinata-secret-key
REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud

# External Services
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-key

# Feature Flags
REACT_APP_ENABLE_BLOCKCHAIN=true
REACT_APP_ENABLE_AI_CHAT=true
REACT_APP_ENABLE_NOTIFICATIONS=true

# Development
REACT_APP_DEBUG_MODE=true
GENERATE_SOURCEMAP=true
```

---

## 🎨 Component Architecture

### Component Hierarchy

#### Layout Components
- **AppLayout** - Main application wrapper
- **Header** - Navigation and user menu
- **Sidebar** - Role-based navigation menu
- **Footer** - Application footer
- **Breadcrumbs** - Navigation breadcrumbs

#### Common Components
- **Button** - Customizable button component
- **Modal** - Reusable modal dialog
- **Form** - Form wrapper with validation
- **Table** - Data table with sorting/filtering
- **Card** - Content card component
- **Loader** - Loading spinner/skeleton
- **Alert** - Notification/alert component

#### Specialized Components
- **ClaimCard** - Insurance claim display
- **DocumentViewer** - PDF/image document viewer
- **ChatBot** - AI assistant interface
- **BlockchainStatus** - Blockchain transaction status
- **HealthMetrics** - Health data visualization

### Component Design Patterns

#### Compound Components
```jsx
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

#### Render Props Pattern
```jsx
<DataFetcher url="/api/claims">
  {({ data, loading, error }) => (
    loading ? <Loader /> : <ClaimsList claims={data} />
  )}
</DataFetcher>
```

#### Custom Hooks Pattern
```jsx
const useAuth = () => {
  // Authentication logic
  return { user, login, logout, isAuthenticated };
};
```

---

## 🔄 State Management

### Context Providers

#### AuthContext
```jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Authentication methods
  const login = async (credentials) => { /* ... */ };
  const logout = () => { /* ... */ };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### ClaimsContext
```jsx
const ClaimsContext = createContext();

export const ClaimsProvider = ({ children }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Claims management methods
  const submitClaim = async (claimData) => { /* ... */ };
  const updateClaimStatus = (claimId, status) => { /* ... */ };
  
  return (
    <ClaimsContext.Provider value={{ claims, loading, submitClaim, updateClaimStatus }}>
      {children}
    </ClaimsContext.Provider>
  );
};
```

#### Web3Context
```jsx
const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  
  // Blockchain interaction methods
  const connectWallet = async () => { /* ... */ };
  const submitToBlockchain = async (data) => { /* ... */ };
  
  return (
    <Web3Context.Provider value={{ web3, account, contract, connectWallet, submitToBlockchain }}>
      {children}
    </Web3Context.Provider>
  );
};
```

---

## 🛣️ Routing Architecture

### Route Configuration
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="claims/*" element={<ClaimsRoutes />} />
        <Route path="profile" element={<Profile />} />
        <Route path="documents" element={<Documents />} />
        
        {/* Role-specific Routes */}
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="provider/*" element={<ProviderRoutes />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

### Protected Route Component
```jsx
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
```

### Role-based Route Protection
```jsx
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  return user?.role === 'admin' ? children : <Unauthorized />;
};
```

---

## 🎯 Key Features Implementation

### 1. Authentication System

#### Login Component
```jsx
const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

#### MetaMask Integration
```jsx
const MetaMaskLogin = () => {
  const { connectWallet } = useWeb3();
  
  const handleMetaMaskLogin = async () => {
    try {
      const account = await connectWallet();
      // Authenticate with backend using wallet address
      await authenticateWithWallet(account);
    } catch (error) {
      console.error('MetaMask login failed:', error);
    }
  };
  
  return (
    <button onClick={handleMetaMaskLogin}>
      Connect with MetaMask
    </button>
  );
};
```

### 2. Claims Management

#### Claim Submission Form
```jsx
const ClaimSubmissionForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { submitClaim } = useClaims();
  const [documents, setDocuments] = useState([]);
  
  const onSubmit = async (data) => {
    const claimData = {
      ...data,
      documents,
      submissionDate: new Date().toISOString()
    };
    
    await submitClaim(claimData);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields and file upload */}
    </form>
  );
};
```

#### Claims Dashboard
```jsx
const ClaimsDashboard = () => {
  const { claims, loading } = useClaims();
  const [filter, setFilter] = useState('all');
  
  const filteredClaims = claims.filter(claim => 
    filter === 'all' || claim.status === filter
  );
  
  return (
    <div>
      <ClaimsFilter filter={filter} onFilterChange={setFilter} />
      {loading ? <Loader /> : <ClaimsList claims={filteredClaims} />}
    </div>
  );
};
```

### 3. Real-time Updates

#### WebSocket Integration
```jsx
const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    setSocket(ws);
    
    return () => ws.close();
  }, [url]);
  
  return { socket, messages };
};
```

#### Notification System
```jsx
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { messages } = useWebSocket(process.env.REACT_APP_WS_URL);
  
  useEffect(() => {
    messages.forEach(message => {
      if (message.type === 'notification') {
        addNotification(message.data);
      }
    });
  }, [messages]);
  
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};
```

### 4. AI Chatbot Interface

#### Chat Component
```jsx
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await chatbotService.sendMessage(input);
      const botMessage = { 
        text: response.data.response, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-container">
      <MessageList messages={messages} />
      <ChatInput 
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
};
```

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
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        healthcare: {
          blue: '#0066cc',
          green: '#00cc66',
          red: '#cc0000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Framer Motion Animations
```jsx
const AnimatedCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-lg shadow-md p-6"
  >
    {children}
  </motion.div>
);
```

### Responsive Design
```jsx
const ResponsiveLayout = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="col-span-1 md:col-span-2 lg:col-span-1">
      {/* Content */}
    </div>
  </div>
);
```

---

## 📱 Progressive Web App (PWA)

### Service Worker Configuration
```javascript
// public/sw.js
const CACHE_NAME = 'healthcare-app-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### Web App Manifest
```json
{
  "short_name": "Healthcare",
  "name": "Healthcare Management Platform",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

---

## 🧪 Testing Strategy

### Unit Testing with Jest
```javascript
// components/__tests__/Button.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing
```javascript
// hooks/__tests__/useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth Hook', () => {
  test('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### End-to-End Testing with Cypress
```javascript
// cypress/integration/claim-submission.spec.js
describe('Claim Submission', () => {
  beforeEach(() => {
    cy.login('patient@example.com', 'password');
    cy.visit('/claims/submit');
  });
  
  it('should submit a claim successfully', () => {
    cy.get('[data-testid="claim-type"]').select('medical');
    cy.get('[data-testid="amount"]').type('1500');
    cy.get('[data-testid="description"]').type('Emergency room visit');
    cy.get('[data-testid="submit-button"]').click();
    
    cy.contains('Claim submitted successfully').should('be.visible');
  });
});
```

---

## 🚀 Build & Deployment

### Build Configuration
```javascript
// package.json scripts
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "build:prod": "NODE_ENV=production npm run build",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

### Environment-specific Builds
```bash
# Development build
npm run start

# Production build
npm run build:prod

# Build with bundle analysis
npm run analyze
```

### Docker Configuration
```dockerfile
# Multi-stage build
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle size optimization
- Caching strategies
- CDN integration for static assets

---

## 🔍 Development Tools

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run storybook` - Start Storybook for component development

### Development Extensions
- React Developer Tools
- Redux DevTools (if using Redux)
- Web3 Developer Tools
- Lighthouse for performance auditing
