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


        import express from 'express';
        import dotenv from 'dotenv';
        import cors from 'cors';
        import mongoose from 'mongoose';
        import authRoutes from './routes/authRoutes.js';
        import userRoutes from './routes/userRoutes.js';
        import contactRoutes from './routes/contactRoutes.js';
        import chatbotRoutes from './routes/chatbotRoutes.js';
        import uploadRoutes from './routes/uploadRoutes.js';
        import claimsRoutes from './routes/claimsRoutes.js';
        import reportRoutes from './routes/reportRoutes.js';
        import userManagementRoutes from './routes/userManagementRoutes.js';
        import complianceRoutes from './routes/complianceRoutes.js';
        import activityLogRoutes from './routes/activityLogRoutes.js';
        import insuranceRoutes from './routes/insuranceRoutes.js';
        import claimRoutes from './routes/claimRoutes.js';
        import claimTrackerRoutes from './routes/claimTrackerRoutes.js';
        import claimHistoryRoutes from './routes/claimHistoryRoutes.js';
        import quoteRoutes from './routes/quote/quoteRoutes.js';
        import claimSubmissionRoutes from './routes/claimSubmissionRoutes.js'; // Import the claim submission route
        import overviewRoutes from './routes/overview.js';
        import approvedClaimsRoutes from './routes/claimApprovalRoutes.js'; // Import the approved claims route
        import pendingClaimsRoutes from './routes/pendingClaimRoute.js'; // Import the pending claims route
        import claimReviewRouter from './routes/claimReview.js';

        dotenv.config();
        
        const app = express();
        app.use(express.json());
        app.use(cors());
        
        // API routes
        app.use('/api/auth', authRoutes);
        app.use('/api/user', userRoutes);
        app.use('/api/contact', contactRoutes);
        app.use('/api/chatbot', chatbotRoutes);
        app.use('/api/', uploadRoutes);
        app.use('/api/claims', claimsRoutes);
        app.use('/api/reports', reportRoutes);
        app.use('/api/users', userManagementRoutes);
        app.use('/api/compliance', complianceRoutes);
        app.use('/api/activity-logs', activityLogRoutes);
        app.use('/api/insurance', insuranceRoutes);
        app.use('/api/claim-history', claimHistoryRoutes);
        app.use('/api/claim-tracker', claimTrackerRoutes);
        app.use('/api/claims', claimRoutes);
        app.use('/api/quote', quoteRoutes);
        
        // Add claim submission route
        app.use('/api/_claims', claimSubmissionRoutes);
        
        // Add the overview route for patients
        app.use('/api/patient', overviewRoutes);
        
        // Add the claims route for approved claims
        app.use('/api/claims/approved', approvedClaimsRoutes);
        
        // Add the claims route for pending claims
        app.use('/api/claims/pending', pendingClaimsRoutes);
        app.use('/api/reviewclaims', claimReviewRouter);
        const PORT = process.env.PORT || 5000;
        
        // MongoDB connection (Simplified)
        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('MongoDB Connected'))
            .catch((err) => console.error('Error connecting to MongoDB:', err));
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        