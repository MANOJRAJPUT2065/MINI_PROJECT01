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
         * Healthcare System Backend Server
         * 
         * This is the main entry point for the healthcare system backend API.
         * It sets up Express.js server with all necessary middleware, routes, and configurations.
         * 
         * Key Features:
         * - RESTful API for healthcare management
         * - JWT-based authentication and authorization
         * - MongoDB database integration
         * - File upload and storage (Cloudinary + IPFS)
         * - AI chatbot integration
         * - Blockchain integration for claim verification
         * - Comprehensive audit logging
         * 
         * @author Healthcare System Team
         * @version 1.0.0
         * @since 2023
         */

        // Core Express.js and configuration imports
        import express from 'express';
        import dotenv from 'dotenv';
        import cors from 'cors';
        import mongoose from 'mongoose';

        // Route imports - organized by functionality
        import authRoutes from './routes/authRoutes.js';                    // Authentication (login, register, password reset)
        import userRoutes from './routes/userRoutes.js';                    // User profile management
        import contactRoutes from './routes/contactRoutes.js';              // Contact form and support
        import chatbotRoutes from './routes/chatbotRoutes.js';              // AI chatbot integration
        import uploadRoutes from './routes/uploadRoutes.js';                // File upload and management
        import claimsRoutes from './routes/claimsRoutes.js';                // General claims operations
        import reportRoutes from './routes/reportRoutes.js';                // Report generation and management
        import userManagementRoutes from './routes/userManagementRoutes.js'; // Admin user management
        import complianceRoutes from './routes/complianceRoutes.js';        // Compliance and audit
        import activityLogRoutes from './routes/activityLogRoutes.js';      // Activity logging
        import insuranceRoutes from './routes/insuranceRoutes.js';          // Insurance policy management
        import claimRoutes from './routes/claimRoutes.js';                  // Claim processing
        import claimTrackerRoutes from './routes/claimTrackerRoutes.js';    // Claim status tracking
        import claimHistoryRoutes from './routes/claimHistoryRoutes.js';    // Claim history retrieval
        import quoteRoutes from './routes/quote/quoteRoutes.js';            // Insurance quotes
        import claimSubmissionRoutes from './routes/claimSubmissionRoutes.js'; // Patient claim submission
        import overviewRoutes from './routes/overview.js';                  // Dashboard overview data
        import approvedClaimsRoutes from './routes/claimApprovalRoutes.js'; // Approved claims management
        import pendingClaimsRoutes from './routes/pendingClaimRoute.js';    // Pending claims processing
        import claimReviewRouter from './routes/claimReview.js';            // Claim review workflow

        // Load environment variables from .env file
        // This must be called before accessing process.env variables
        dotenv.config();
        
        /**
         * Initialize Express application
         * 
         * Creates the main Express application instance and configures
         * essential middleware for request processing, security, and CORS.
         */
        const app = express();

        // =============================================================================
        // MIDDLEWARE CONFIGURATION
        // =============================================================================

        /**
         * JSON Body Parser Middleware
         * 
         * Parses incoming JSON requests and makes the parsed data available
         * under the req.body property. This is essential for handling API requests
         * that send JSON data in the request body.
         * 
         * @middleware express.json
         * @limit 10mb - Maximum request body size to prevent abuse
         */
        app.use(express.json({ limit: '10mb' }));

        /**
         * URL-encoded Body Parser Middleware
         * 
         * Parses incoming requests with URL-encoded payloads (typically from HTML forms)
         * and makes the parsed data available under req.body.
         * 
         * @middleware express.urlencoded
         * @extended true - Uses qs library for parsing (supports nested objects)
         */
        app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        /**
         * CORS (Cross-Origin Resource Sharing) Middleware
         * 
         * Enables cross-origin requests from the frontend application.
         * This is crucial for allowing the React frontend to communicate
         * with the backend API when they are served from different origins.
         * 
         * @middleware cors
         * @origin process.env.CLIENT_URL - Allows requests from frontend URL
         * @credentials true - Allows cookies and authorization headers
         */
        app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));
        
        // =============================================================================
        // API ROUTES CONFIGURATION
        // =============================================================================

        /**
         * API Route Mounting
         * 
         * All API routes are mounted under the '/api' prefix to clearly separate
         * API endpoints from static content. Each route group handles specific
         * functionality and is organized by feature area.
         * 
         * Route Organization:
         * - Authentication & User Management
         * - Claims Processing & Management
         * - File Upload & Storage
         * - AI & Chatbot Services
         * - Analytics & Reporting
         * - Admin & Compliance
         */

        // Authentication and User Management Routes
        app.use('/api/auth', authRoutes);                    // POST /login, /register, /forgot-password, /reset-password
        app.use('/api/user', userRoutes);                    // GET /profile, PUT /profile
        app.use('/api/users', userManagementRoutes);         // Admin user management (CRUD operations)

        // Claims Processing Routes
        app.use('/api/claims', claimsRoutes);                // General claims operations
        app.use('/api/claims', claimRoutes);                 // Claim processing and management
        app.use('/api/_claims', claimSubmissionRoutes);      // Patient claim submission (blockchain integration)
        app.use('/api/claims/approved', approvedClaimsRoutes); // Approved claims management
        app.use('/api/claims/pending', pendingClaimsRoutes); // Pending claims processing
        app.use('/api/reviewclaims', claimReviewRouter);     // Claim review workflow

        // Claim Tracking and History
        app.use('/api/claim-history', claimHistoryRoutes);   // GET /history - Claim history retrieval
        app.use('/api/claim-tracker', claimTrackerRoutes);   // GET /:claimId - Real-time claim tracking

        // Insurance and Policy Management
        app.use('/api/insurance', insuranceRoutes);          // Insurance policy operations
        app.use('/api/quote', quoteRoutes);                  // Insurance quote generation

        // File Upload and Storage
        app.use('/api/', uploadRoutes);                      // POST /upload, /upload-report, GET /reports

        // AI and Communication Services
        app.use('/api/chatbot', chatbotRoutes);              // POST /send - AI chatbot integration
        app.use('/api/contact', contactRoutes);              // POST /send - Contact form submission

        // Analytics and Reporting
        app.use('/api/reports', reportRoutes);               // POST /generate, /send-email - Report generation
        app.use('/api/patient', overviewRoutes);             // Dashboard overview data for patients

        // Compliance and Audit
        app.use('/api/compliance', complianceRoutes);        // Compliance management
        app.use('/api/activity-logs', activityLogRoutes);    // Activity logging and audit trails
        // =============================================================================
        // DATABASE CONNECTION
        // =============================================================================

        /**
         * MongoDB Connection
         * 
         * Establishes connection to MongoDB database using Mongoose ODM.
         * The connection string is loaded from environment variables for security.
         * 
         * Connection Options:
         * - useNewUrlParser: Uses new MongoDB driver URL parser
         * - useUnifiedTopology: Uses new connection management engine
         * - serverSelectionTimeoutMS: Timeout for server selection
         * - maxPoolSize: Maximum number of connections in the pool
         * - minPoolSize: Minimum number of connections in the pool
         */
        const PORT = process.env.PORT || 5000;
        
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 2,  // Maintain a minimum of 2 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
        })
        .then(() => {
            console.log('✅ MongoDB Connected Successfully');
            console.log(`📊 Database: ${mongoose.connection.name}`);
            console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
        })
        .catch((err) => {
            console.error('❌ Error connecting to MongoDB:', err);
            console.error('🔧 Please check your MONGO_URI in the .env file');
            console.error('🔧 Ensure MongoDB is running and accessible');
            process.exit(1); // Exit the process if database connection fails
        });

        // =============================================================================
        // SERVER STARTUP
        // =============================================================================

        /**
         * Start Express Server
         * 
         * Starts the HTTP server and listens on the specified port.
         * The server will handle incoming requests and route them to
         * the appropriate route handlers.
         * 
         * @param {number} PORT - Port number to listen on (default: 5000)
         * @param {Function} callback - Callback function executed when server starts
         */
        app.listen(PORT, () => {
            console.log('\n🚀 Healthcare System Backend Server Started');
            console.log('==========================================');
            console.log(`🌐 Server running on port ${PORT}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
            console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`⏰ Started at: ${new Date().toISOString()}`);
            console.log('==========================================\n');
            
            // Log available API endpoints
            console.log('📋 Available API Endpoints:');
            console.log('   🔐 Authentication: /api/auth');
            console.log('   👤 User Management: /api/user, /api/users');
            console.log('   📄 Claims Processing: /api/claims, /api/_claims');
            console.log('   📊 Analytics: /api/reports, /api/patient');
            console.log('   🤖 AI Services: /api/chatbot');
            console.log('   📁 File Upload: /api/upload');
            console.log('   📞 Contact: /api/contact');
            console.log('   🔍 Tracking: /api/claim-tracker, /api/claim-history');
            console.log('   🏥 Insurance: /api/insurance, /api/quote');
            console.log('   📋 Compliance: /api/compliance, /api/activity-logs');
        });

        // =============================================================================
        // ERROR HANDLING
        // =============================================================================

        /**
         * Global Error Handler
         * 
         * Catches any unhandled errors in the application and provides
         * a consistent error response format. This prevents the server
         * from crashing due to unhandled exceptions.
         */
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            // Application specific logging, throwing an error, or other logic here
        });

        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            console.error('🔄 Server will restart...');
            process.exit(1);
        });

        /**
         * Graceful Shutdown
         * 
         * Handles graceful shutdown of the server when receiving
         * termination signals (SIGTERM, SIGINT).
         */
        const gracefulShutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
            
            // Close server
            app.close(() => {
                console.log('✅ HTTP server closed');
                
                // Close database connection
                mongoose.connection.close(false, () => {
                    console.log('✅ MongoDB connection closed');
                    console.log('👋 Server shutdown complete');
                    process.exit(0);
                });
            });
        };

        // Listen for termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        