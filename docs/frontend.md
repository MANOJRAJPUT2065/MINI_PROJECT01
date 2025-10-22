# Frontend Documentation (React.js)

## 🚀 Quick Start

- **Start Command**: `npm start`
- **Port**: 3000
- **Development Server**: `http://localhost:3000`
- **Build Command**: `npm run build`
- **Test Command**: `npm test`

## 🔧 Environment Configuration

Create a `.env` file in the frontend directory for environment-specific variables:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000

# Blockchain Configuration
REACT_APP_INFURA_API_KEY=your-infura-api-key
REACT_APP_CONTRACT_ADDRESS=your-smart-contract-address
REACT_APP_NETWORK_ID=1  # 1 for mainnet, 3 for ropsten, etc.

# IPFS Configuration (optional)
REACT_APP_PINATA_API_KEY=your-pinata-api-key
REACT_APP_PINATA_SECRET_API_KEY=your-pinata-secret-key

# AI Services
REACT_APP_OPENAI_API_KEY=your-openai-api-key

# Environment
REACT_APP_ENV=development
```

## 🏗️ Project Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── Pages/           # Page-level components
│   ├── Dashboards/      # Dashboard components
│   ├── InsurancePages/  # Insurance-specific pages
│   ├── DoctorPages/     # Doctor dashboard pages
│   └── Common/          # Shared components
├── assets/              # Static assets (images, icons)
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── utils/               # Utility functions
├── services/            # API service functions
└── styles/              # Global styles and themes
```

## 🎨 UI/UX Design System

### Technology Stack
- **React 18**: Latest React with hooks and concurrent features
- **Material-UI (MUI)**: Comprehensive component library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions
- **Ant Design**: Additional UI components for complex interfaces

### Design Principles
- **Mobile-First**: Responsive design starting from mobile devices
- **Accessibility**: WCAG 2.1 AA compliance
- **Consistency**: Unified design language across all components
- **Performance**: Optimized for fast loading and smooth interactions

### Color Palette
```css
:root {
  --primary-color: #2563eb;      /* Blue for trust and healthcare */
  --secondary-color: #10b981;    /* Green for success and health */
  --accent-color: #f59e0b;       /* Orange for warnings and highlights */
  --danger-color: #ef4444;       /* Red for errors and critical actions */
  --success-color: #22c55e;      /* Green for success states */
  --warning-color: #f59e0b;      /* Orange for warnings */
  --info-color: #3b82f6;         /* Blue for information */
  --neutral-50: #f9fafb;         /* Light backgrounds */
  --neutral-900: #111827;        /* Dark text */
}
```

## 🔐 Authentication & State Management

### Authentication Flow
1. **Login Options**: Email/password or MetaMask wallet
2. **Token Storage**: JWT tokens stored in localStorage
3. **Route Protection**: Protected routes with authentication checks
4. **Role-based Access**: Different UI based on user role

### State Management
- **React Context**: Global state for authentication and user data
- **useState/useReducer**: Local component state management
- **Custom Hooks**: Reusable stateful logic

### Example Authentication Hook
```javascript
// hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🧩 Component Architecture

### Page Components
Each page is a self-contained component with its own state and logic:

- **HomeScreen**: Landing page with features overview
- **Login/Register**: Authentication pages
- **Dashboards**: Role-specific dashboard components
- **Insurance Pages**: Claims, policies, and management
- **Doctor Pages**: Medical professional tools

### Reusable Components
- **Form Components**: Input fields, buttons, validation
- **Data Display**: Tables, cards, charts
- **Navigation**: Sidebar, header, breadcrumbs
- **Modals**: Confirmation dialogs, forms

### Example Component Structure
```javascript
// components/Common/DataTable.jsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel
} from '@mui/material';

const DataTable = ({ 
  data, 
  columns, 
  onRowClick, 
  sortable = true,
  pagination = true 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    if (!sortable || !orderBy) return data;
    
    return [...data].sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
  }, [data, orderBy, order]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                {sortable ? (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow 
                key={index} 
                hover
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </TableContainer>
  );
};

export default DataTable;
```

## 🔌 API Integration

### Service Layer
Centralized API calls with error handling and authentication:

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Examples
```javascript
// services/claimService.js
import api from './api';

export const claimService = {
  // Submit new claim
  submitClaim: async (claimData) => {
    const response = await api.post('/api/_claims/submit', claimData);
    return response.data;
  },

  // Get user's claims
  getUserClaims: async (userId) => {
    const response = await api.get(`/api/claim-history/history?userId=${userId}`);
    return response.data;
  },

  // Track claim status
  trackClaim: async (claimId) => {
    const response = await api.get(`/api/claim-tracker/${claimId}`);
    return response.data;
  },

  // Upload claim documents
  uploadDocuments: async (claimId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await api.post(`/api/claims/upload-report`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
```

## 🎭 Routing & Navigation

### Route Structure
```javascript
// App.js routing structure
const routes = [
  // Public routes
  { path: '/', component: HomeScreen },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/about', component: About },
  { path: '/contact', component: ContactUs },
  
  // Protected routes
  { path: '/dashboard/patient', component: UserDashboard, roles: ['patient'] },
  { path: '/dashboard/doctor', component: AdminDashboard, roles: ['doctor'] },
  { path: '/dashboard/insurer', component: InsuranceDashboard, roles: ['insurer'] },
  { path: '/dashboard/admin', component: AdminDashboard, roles: ['admin'] },
];
```

### Protected Route Component
```javascript
// components/Pages/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

## 📱 Responsive Design

### Breakpoints
```javascript
const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
};
```

### Mobile-First Approach
- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: Two-column layout, larger touch targets
- **Desktop**: Multi-column layout, hover effects, keyboard navigation

## 🧪 Testing

### Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test                    # Run all tests
npm run test:coverage      # Run with coverage report
npm run test:watch         # Run in watch mode
```

### Test Examples
```javascript
// components/__tests__/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Pages/Login';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      // Assert expected behavior after form submission
    });
  });
});
```

## 🚀 Performance Optimization

### Code Splitting
```javascript
// Lazy loading for better performance
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboards/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/Dashboards/AdminDashboard'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Split code into smaller chunks
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Compress and optimize images

## 🚀 Deployment

### Build Process
```bash
# Create production build
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

### Environment-Specific Builds
```javascript
// Different configurations for different environments
const config = {
  development: {
    API_URL: 'http://localhost:5000',
    DEBUG: true
  },
  production: {
    API_URL: 'https://api.healthcaresystem.com',
    DEBUG: false
  }
};
```

### Docker Support
```dockerfile
# Dockerfile for frontend
FROM node:18-alpine as build

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
