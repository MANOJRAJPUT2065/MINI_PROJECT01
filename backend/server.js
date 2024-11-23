
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; // Import the contact routes
import chatbotRoutes from './routes/chatbotRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import claimsRoutes from './routes/claimsRoutes.js'; 
import reportRoutes from './routes/reportRoutes.js'; // Import report routes
import userManagementRoutes from './routes/userManagementRoutes.js'; // Import user management routes

import complianceRoutes from './routes/complianceRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js'; 

import claimRoutes from './routes/claimRoutes.js';;
import claimTrackerRoutes from './routes/claimTrackerRoutes.js';



import quoteRoutes from './routes/quote/quoteRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());




app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes); 
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/', uploadRoutes); 
app.use('/api/claims', claimsRoutes);
app.use('/api/reports', reportRoutes); // To download the report
// TODO: Still i have to work on this user management
app.use('/api/users', userManagementRoutes); // Add user management routes

// ----------------------------------------------------------------------------//

app.use('/api/compliance', complianceRoutes);
app.use('/api/activity-logs', activityLogRoutes);


app.use('/api/insurance', insuranceRoutes);  


app.use('/api/claim-tracker', claimTrackerRoutes); // Add claim tracking routes here

app.use('/api/claims', claimRoutes);
app.use('/api/quote', quoteRoutes); 

const PORT = process.env.PORT || 5000;

// MongoDB connection (Simplified)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


 