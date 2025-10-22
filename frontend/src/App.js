
/**
 * Healthcare Platform - Main Application Component
 * 
 * This is the root component of the React application that handles:
 * - Application routing and navigation
 * - Authentication state management
 * - Route protection and access control
 * - Component lazy loading and code splitting
 * 
 * The application supports multiple user roles:
 * - Patients: Access to personal health records, claim submissions, and tracking
 * - Healthcare Providers (Doctors): Patient management, claim processing, and medical records
 * - Insurance Companies: Claims review, policy management, and fraud detection
 * - System Administrators: User management, system configuration, and analytics
 * 
 * @author Healthcare Platform Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ============================================================================
// AUTHENTICATION & SECURITY COMPONENTS
// ============================================================================

/**
 * Authentication components for user login, registration, and password management
 * These components handle secure user authentication with JWT tokens and 
 * optional blockchain-based authentication via MetaMask
 */
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import ProtectedRoute from './components/Pages/ProtectedRoute';
import NotFound from './components/Pages/NotFound';
import ForgotPassword from './components/Pages/ForgotPassword.js';
import ResetPassword from './components/Pages/ResetPassword.js';

// ============================================================================
// MAIN DASHBOARD & PUBLIC PAGES
// ============================================================================

/**
 * Core application pages accessible to all users
 * - HomeScreen: Landing page with platform overview and features
 * - About: Information about the healthcare platform
 * - ContactUs: Contact form and support information
 * - HealthInsurance: Public insurance information and plans
 */
import HomeScreen from './components/Dashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import About from './components/Pages/About.js';
import ContactUs from './components/Pages/ContactUs.js';

// ============================================================================
// INSURANCE COMPANY DASHBOARD COMPONENTS
// ============================================================================

/**
 * Insurance company specific components for managing:
 * - Policy administration and underwriting
 * - Claims processing and review workflows
 * - Fraud detection and prevention
 * - Customer relationship management
 * - Regulatory compliance and reporting
 */
import InsuranceDashboard from './components/Dashboards/Insure.js';
import Insure from './components/Dashboards/Insure.js';
import Policies from './components/InsurancePages/Policies.js';
import HealthInsurance from './components/Pages/HealthInsurance.js';
import ClaimStatus from './components/InsurancePages/ClaimStatus.js';
import DashboardOverview from './components/InsurancePages/DashboardOverview.js';
import ClaimsManagement from './components/InsurancePages/ClaimsManagement.js';
import PendingClaims from './components/InsurancePages/PendingClaims.js';
import ApprovedClaims from './components/InsurancePages/ApprovedClaims.js';
import RejectedClaims from './components/InsurancePages/RejectedClaims.js';
import ClaimsHistory from './components/InsurancePages/ClaimsHistory.js';
import Reports from './components/InsurancePages/Reports.js';
import UserManagement from './components/InsurancePages/UserManagement.js';
import Compliance from './components/InsurancePages/Compliance.js';

// ============================================================================
// HEALTHCARE PROVIDER (DOCTOR) DASHBOARD COMPONENTS
// ============================================================================

/**
 * Healthcare provider specific components for:
 * - Patient record management and EMR integration
 * - Medical claim submissions and tracking
 * - Treatment documentation and billing
 * - Blockchain-based identity verification
 * - Secure communication with patients and insurers
 * - Compliance with medical regulations (HIPAA, etc.)
 */
import ManagePolicies from './components/DoctorPages/ManagePolicies';
import ManageUsers from './components/DoctorPages/ManageUsers';
import ManageClaims from './components/DoctorPages/ManageClaims';
import EditUser from './components/DoctorPages/EditUser';
import ViewClaims from './components/DoctorPages/ViewClaims';
import ViewReports from './components/DoctorPages/ViewReports';
import ViewCompliance from './components/DoctorPages/ViewCompliance';
import SystemSettings from './components/DoctorPages/SystemSettings';
import ClaimStatusTracker from './components/DoctorPages/ClaimStatusTracker';
import SmartContractInteraction from './components/DoctorPages/SmartContractInteraction';
import ActivityLog from './components/DoctorPages/ActivityLog.js';
import SecureCommunication from './components/DoctorPages/SecureCommunication';
import DoctorReview from './components/DoctorPages/DoctorReview.js';

// ============================================================================
// PATIENT DASHBOARD COMPONENTS
// ============================================================================

/**
 * Patient-specific components providing:
 * - Personal health record access and management
 * - Insurance claim submission and tracking
 * - Medical document upload and storage
 * - Health metrics monitoring and analytics
 * - Appointment scheduling and telemedicine
 * - AI-powered health assistance and support
 */
import ClaimSubmission from './components/Dashboards/PatientDashboard/ClaimSubmission';
// import ClaimReview from './components/Dashboards/PatientDashboard/ClaimReview'; // Currently disabled
import Settings from './components/Dashboards/PatientDashboard/Settings.js';
import TrackClaims from './components/Dashboards/PatientDashboard/TrackClaims.js';
import PatientReports from './components/Dashboards/PatientDashboard/PatientReports.js';
import PatientDashboardOverview from './components/Dashboards/PatientDashboard/PatientDashboardOverview.js';

/**
 * Main Application Component
 * 
 * Manages global application state and routing configuration.
 * Implements authentication state management and route protection.
 */
function App() {
    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    
    /**
     * Authentication state management
     * Tracks whether the current user is authenticated based on JWT token presence
     * This state is used by ProtectedRoute components to control access
     */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ========================================================================
    // LIFECYCLE EFFECTS
    // ========================================================================
    
    /**
     * Authentication state initialization
     * Checks for existing JWT token in localStorage on app startup
     * This allows users to remain logged in across browser sessions
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Convert to boolean: token exists = true, null/undefined = false
        
        // Optional: Validate token with backend to ensure it's still valid
        // This would require an API call to verify token expiration
        if (token) {
            // TODO: Implement token validation
            // validateToken(token).then(isValid => setIsAuthenticated(isValid));
        }
    }, []);

    // ========================================================================
    // RENDER APPLICATION ROUTES
    // ========================================================================
    
    return (
        <Router>
            <Routes>
                {/* ============================================================ */}
                {/* PUBLIC ROUTES - Accessible without authentication */}
                {/* ============================================================ */}
                
                {/* Landing page with platform overview and feature highlights */}
                <Route path="/" element={<HomeScreen />} />
                
                {/* Authentication routes for user login and registration */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Password recovery workflow */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {/* Public information pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/insurance" element={<HealthInsurance />} />
                
                {/* ============================================================ */}
                {/* INSURANCE COMPANY ROUTES - Claims and Policy Management */}
                {/* ============================================================ */}
                
                {/* Main insurance dashboard and overview */}
                <Route path="/dashboard" element={<InsuranceDashboard />} />
                <Route path="/dashboard-overview" element={<DashboardOverview />} />
                
                {/* Policy management and administration */}
                <Route path="/policies" element={<Policies />} />
                
                {/* Claims processing workflow */}
                <Route path="/claims" element={<ClaimsManagement />} />
                <Route path="/claim-status" element={<ClaimStatus />} />
                <Route path="/pending-claims" element={<PendingClaims />} />
                <Route path="/approved-claims" element={<ApprovedClaims />} />
                <Route path="/rejected-claims" element={<RejectedClaims />} />
                <Route path="/claims-history" element={<ClaimsHistory />} />
                
                {/* Analytics and reporting */}
                <Route path="/reports" element={<Reports />} />
                
                {/* Administrative functions */}
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/compliance" element={<Compliance />} />

                {/* ============================================================ */}
                {/* HEALTHCARE PROVIDER (DOCTOR) ROUTES */}
                {/* ============================================================ */}
                
                {/* Main doctor/admin dashboard */}
                <Route path="/dashboard/doctor" element={<AdminDashboard />} />
                
                {/* Policy and user management */}
                <Route path="/dashboard/doctor/manage-policies" element={<ManagePolicies />} />
                <Route path="/dashboard/doctor/manage-users" element={<ManageUsers />} />
                <Route path="/dashboard/doctor/edit-user/:userId" element={<EditUser />} />
                
                {/* Claims management and processing */}
                <Route path="/dashboard/doctor/manage-claims" element={<ManageClaims />} />
                <Route path="/dashboard/doctor/view-claims" element={<ViewClaims />} />
                <Route path="/dashboard/doctor/claim-submission" element={<DoctorReview />} />
                <Route path="/dashboard/doctor/track-claim-status" element={<ClaimStatusTracker />} />
                
                {/* Reporting and analytics */}
                <Route path="/dashboard/doctor/view-reports" element={<ViewReports />} />
                <Route path="/dashboard/doctor/view-compliance" element={<ViewCompliance />} />
                
                {/* System administration */}
                <Route path="/dashboard/doctor/system-settings" element={<SystemSettings />} />
                <Route path="/dashboard/doctor/activity-log" element={<ActivityLog />} />
                
                {/* Advanced features */}
                <Route path="/dashboard/doctor/smart-contract-interaction" element={<SmartContractInteraction />} />
                <Route path="/dashboard/doctor/secure-communication" element={<SecureCommunication />} />

                {/* ============================================================ */}
                {/* PATIENT DASHBOARD ROUTES - Nested routing structure */}
                {/* ============================================================ */}
                
                {/* 
                 * Patient dashboard with nested routes for better organization
                 * All patient-specific functionality is grouped under /dashboard/patient
                 */}
                <Route path="/dashboard/patient" element={<UserDashboard />}>
                    {/* Patient dashboard home with health overview */}
                    <Route path="dashboard-overview" element={<PatientDashboardOverview/>} />
                    
                    {/* Claims management for patients */}
                    <Route path="claim-submission" element={<ClaimSubmission />} />
                    <Route path="track-claims" element={<TrackClaims />} />
                    
                    {/* Medical records and reports */}
                    <Route path="view-reports" element={<PatientReports />} />
                    
                    {/* Account settings and preferences */}
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* ============================================================ */}
                {/* PROTECTED ROUTES - Require authentication */}
                {/* ============================================================ */}
                
                {/* 
                 * Legacy protected routes for backward compatibility
                 * These routes require authentication and redirect to login if not authenticated
                 */}
                <Route 
                    path="/dashboard/user" 
                    element={
                        <ProtectedRoute 
                            isAuthenticated={isAuthenticated} 
                            element={<UserDashboard />} 
                        />
                    } 
                />
                <Route 
                    path="/dashboard/admin" 
                    element={
                        <ProtectedRoute 
                            isAuthenticated={isAuthenticated} 
                            element={<AdminDashboard />} 
                        />
                    } 
                />
                <Route 
                    path="/dashboard/insurer" 
                    element={
                        <ProtectedRoute 
                            isAuthenticated={isAuthenticated} 
                            element={<Insure />} 
                        />
                    } 
                />

                {/* ============================================================ */}
                {/* FALLBACK ROUTES */}
                {/* ============================================================ */}
                
                {/* 404 Not Found - Must be last route to catch all unmatched paths */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;



