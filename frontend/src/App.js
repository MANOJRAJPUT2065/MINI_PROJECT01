    import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import Login from './components/Login';
    import Register from './components/Register';
    import AdminDashboard from './components/AdminDashboard';
    import UserDashboard from './components/UserDashboard';
    import ProtectedRoute from './components/ProtectedRoute';
    import HomeScreen from './components/Dashboard';
    import NotFound from './components/NotFound';
    import ForgotPassword from './components/ForgotPassword.js';
    import ResetPassword from './components/ResetPassword.js';
import About from './components/About.js';
import ContactUs from './components/ContactUs.js';
import HealthInsurance from './components/HealthInsurance.js';
    function App() {
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token); // If token exists, set to true
        }, []);

        return (
            <Router>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/insurance" element={<HealthInsurance />} />
                    {/* Protected Routes */}
                    <Route 
                        path="/dashboard/user" 
                        element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<UserDashboard />} />} 
                    />
                    <Route 
                        path="/dashboard/admin" 
                        element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<AdminDashboard />} />} 
                    />
                    <Route path="*" element={<NotFound />} /> {/* Fallback route */}

                    <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                </Routes>
            </Router>
        );
    }

    export default App;
