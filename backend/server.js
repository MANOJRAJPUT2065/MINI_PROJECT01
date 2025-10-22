        // import express from 'express';
        // import dotenv from 'dotenv';
        // import cors from 'cors';
        // import mongoose from 'mongoose';
        // import authRoutes from './routes/authRoutes.js';
        // import userRoutes from './routes/userRoutes.js';
        // import contactRoutes from './routes/contactRoutes.js';
        // import chatbotRoutes from './routes/chatbotRoutes.js';
        // import uploadRoutes from './routes/uploadRoutes.js';
        // import claimsRoutes from './routes/claimsRoutes.js';
        // import reportRoutes from './routes/reportRoutes.js';
        // import userManagementRoutes from './routes/userManagementRoutes.js';
        // import complianceRoutes from './routes/complianceRoutes.js';
        // import activityLogRoutes from './routes/activityLogRoutes.js';
        // import insuranceRoutes from './routes/insuranceRoutes.js';
        // import claimRoutes from './routes/claimRoutes.js';
        // import claimTrackerRoutes from './routes/claimTrackerRoutes.js';
        // import claimHistoryRoutes from './routes/claimHistoryRoutes.js';
        // import quoteRoutes from './routes/quote/quoteRoutes.js';
        // import claimSubmissionRoutes from './routes/claimSubmissionRoutes.js'; // Import the claim submission route
        // import overviewRoutes from './routes/overview.js';
        
        // import approvedClaimsRoutes from './routes/claimApprovalRoutes.js'
        // // import approvedClaimsRoutes from './routes/claimApprovalRoutes.js';
        // import pendingClaimsRoutes from './routes/pendingClaimRoute.js';
        // dotenv.config();

        // const app = express();
        // app.use(express.json());
        // app.use(cors());

        // app.use('/api/auth', authRoutes);
        // app.use('/api/user', userRoutes);
        // app.use('/api/contact', contactRoutes);
        // app.use('/api/chatbot', chatbotRoutes);
        // app.use('/api/', uploadRoutes);
        // app.use('/api/claims', claimsRoutes);
        // app.use('/api/reports', reportRoutes);
        // app.use('/api/users', userManagementRoutes);
        // app.use('/api/compliance', complianceRoutes);
        // app.use('/api/activity-logs', activityLogRoutes);
        // app.use('/api/insurance', insuranceRoutes);
        // app.use('/api/claim-history', claimHistoryRoutes);
        // app.use('/api/claim-tracker', claimTrackerRoutes);
        // app.use('/api/claims', claimRoutes);
        // app.use('/api/quote', quoteRoutes);

        // // Add the claim submission route
        // app.use('/api/_claims', claimSubmissionRoutes);

        // app.use('/api/patient', overviewRoutes);

        // app.use('/api/claims', approvedClaimsRoutes)
        // app.use('/api/claims/', pendingClaimsRoutes);

        // const PORT = process.env.PORT || 5000;

        // // MongoDB connection (Simplified)
        // mongoose.connect(process.env.MONGO_URI)
        //     .then(() => console.log('MongoDB Connected'))
        //     .catch((err) => console.error('Error connecting to MongoDB:', err));

        // app.listen(PORT, () => {
        //     console.log(`Server running on port ${PORT}`);
        // });


/**
 * Healthcare Platform Backend Server
 * 
 * This is the main server file for the healthcare management platform.
 * It sets up the Express.js server with all necessary middleware, routes,
 * and database connections for handling healthcare operations including:
 * - User authentication and authorization
 * - Insurance claim processing and management
 * - Document upload and storage
 * - AI-powered chatbot services
 * - Blockchain integration for claim verification
 * - Real-time notifications and updates
 * 
 * @author Healthcare Platform Team
 * @version 1.0.0
 */

// Core dependencies for server setup
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Route imports organized by functionality
// Authentication and user management routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import userManagementRoutes from './routes/userManagementRoutes.js';

// Communication and support routes
import contactRoutes from './routes/contactRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Document and file management routes
import uploadRoutes from './routes/uploadRoutes.js';

// Claims processing routes (multiple endpoints for different claim operations)
import claimsRoutes from './routes/claimsRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import claimSubmissionRoutes from './routes/claimSubmissionRoutes.js'; // Patient claim submissions
import approvedClaimsRoutes from './routes/claimApprovalRoutes.js'; // Approved claims management
import pendingClaimsRoutes from './routes/pendingClaimRoute.js'; // Pending claims review
import claimReviewRouter from './routes/claimReview.js'; // Claim review workflow
import claimTrackerRoutes from './routes/claimTrackerRoutes.js'; // Real-time claim tracking
import claimHistoryRoutes from './routes/claimHistoryRoutes.js'; // Historical claim data

// Insurance and financial routes
import insuranceRoutes from './routes/insuranceRoutes.js';
import quoteRoutes from './routes/quote/quoteRoutes.js';

// Analytics and reporting routes
import reportRoutes from './routes/reportRoutes.js';
import overviewRoutes from './routes/overview.js'; // Patient dashboard overview

// Compliance and audit routes
import complianceRoutes from './routes/complianceRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';

// Load environment variables from .env file
// This must be called before accessing process.env variables
dotenv.config();

// Initialize Express application
const app = express();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Body parsing middleware
 * Enables the server to parse JSON payloads in request bodies
 * Limit set to prevent DoS attacks through large payloads
 */
app.use(express.json({ limit: '10mb' }));

/**
 * URL-encoded data parsing middleware
 * Handles form data submissions
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Allows frontend applications to communicate with the API
 * In production, this should be configured with specific origins
 */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============================================================================
// API ROUTE CONFIGURATION
// ============================================================================

/**
 * Authentication Routes (/api/auth)
 * Handles user registration, login, password reset, and email verification
 */
app.use('/api/auth', authRoutes);

/**
 * User Profile Routes (/api/user)
 * Manages user profile information, preferences, and settings
 */
app.use('/api/user', userRoutes);

/**
 * Contact and Communication Routes (/api/contact)
 * Handles contact form submissions and general inquiries
 */
app.use('/api/contact', contactRoutes);

/**
 * AI Chatbot Routes (/api/chatbot)
 * Provides AI-powered health assistance and claim support
 */
app.use('/api/chatbot', chatbotRoutes);

/**
 * File Upload Routes (/api/)
 * Handles document uploads, medical reports, and file management
 * Note: Mounted on root API path for backward compatibility
 */
app.use('/api/', uploadRoutes);

/**
 * Claims Management Routes (Multiple endpoints)
 * 
 * /api/claims - General claims operations (doctor submissions, analytics)
 * /api/_claims - Patient claim submissions with blockchain integration
 * /api/claims/approved - Approved claims processing and payments
 * /api/claims/pending - Pending claims review and validation
 * /api/reviewclaims - Claim review workflow management
 */
app.use('/api/claims', claimsRoutes);
app.use('/api/_claims', claimSubmissionRoutes);
app.use('/api/claims/approved', approvedClaimsRoutes);
app.use('/api/claims/pending', pendingClaimsRoutes);
app.use('/api/reviewclaims', claimReviewRouter);

/**
 * Claim Tracking and History Routes
 * Provides real-time claim status updates and historical data
 */
app.use('/api/claim-tracker', claimTrackerRoutes);
app.use('/api/claim-history', claimHistoryRoutes);

/**
 * Insurance and Quote Routes
 * Handles insurance policy information and quote generation
 */
app.use('/api/insurance', insuranceRoutes);
app.use('/api/quote', quoteRoutes);

/**
 * Reporting and Analytics Routes (/api/reports)
 * Generates custom reports and provides business intelligence
 */
app.use('/api/reports', reportRoutes);

/**
 * Patient Dashboard Overview (/api/patient)
 * Provides consolidated patient information and recent activities
 */
app.use('/api/patient', overviewRoutes);

/**
 * Administrative Routes (/api/users)
 * User management, role assignment, and system administration
 * Requires admin privileges for access
 */
app.use('/api/users', userManagementRoutes);

/**
 * Compliance and Audit Routes
 * Handles regulatory compliance reporting and activity logging
 */
app.use('/api/compliance', complianceRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// ============================================================================
// SERVER CONFIGURATION
// ============================================================================

/**
 * Server port configuration
 * Uses environment variable PORT or defaults to 5000
 * This allows for flexible deployment across different environments
 */
const PORT = process.env.PORT || 5000;

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

/**
 * MongoDB connection setup using Mongoose ODM
 * 
 * Connection options for production should include:
 * - Connection pooling
 * - Retry logic
 * - SSL/TLS configuration
 * - Read/write concern settings
 */
mongoose.connect(process.env.MONGO_URI, {
    // Connection options for better performance and reliability
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long to wait for a response
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // Disable mongoose buffering
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
})
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('🔧 Please check your MONGO_URI environment variable');
    process.exit(1); // Exit process if database connection fails
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the Express server
 * Listens on the configured port and provides startup information
 */
app.listen(PORT, () => {
    console.log('\n🚀 Healthcare Platform Backend Server Started');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log('\n📋 Available API Endpoints:');
    console.log('   • Authentication: /api/auth');
    console.log('   • User Management: /api/user');
    console.log('   • Claims Processing: /api/claims, /api/_claims');
    console.log('   • Document Upload: /api/upload');
    console.log('   • AI Chatbot: /api/chatbot');
    console.log('   • Analytics: /api/reports');
    console.log('   • Admin Panel: /api/users');
    console.log('\n🔍 Health Check: GET /api/health');
    console.log('📚 API Documentation: See docs/api.md\n');
});

// ============================================================================
// GRACEFUL SHUTDOWN HANDLING
// ============================================================================

/**
 * Handle graceful shutdown on SIGTERM (production deployment)
 */
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Starting graceful shutdown...');
    
    // Close MongoDB connection
    mongoose.connection.close(() => {
        console.log('📊 MongoDB connection closed.');
        process.exit(0);
    });
});

/**
 * Handle graceful shutdown on SIGINT (Ctrl+C in development)
 */
process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received. Starting graceful shutdown...');
    
    // Close MongoDB connection
    mongoose.connection.close(() => {
        console.log('📊 MongoDB connection closed.');
        console.log('👋 Server shutdown complete. Goodbye!');
        process.exit(0);
    });
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Close server & exit process
    process.exit(1);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
        