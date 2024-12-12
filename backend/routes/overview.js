


// import express from 'express';
// import mongoose from 'mongoose';
// const router = express.Router();

// // Importing models (ensure the paths are correct)
// import ClaimStatus from '../models/ClaimStatus.js'; 
// import ClaimSubmission from '../models/ClaimSubmission.js'; 
// import RecentActivities from '../models/overviewmodels/RecentActivities.js';
// import Notification from '../models/overviewmodels/Notification.js';

// // Mock static data
// const staticData = {
//     claimStatusProgress: [20, 40, 60, 80], // Example static data
//     claimSubmissions: [3, 5, 2, 8, 6, 4],
//     recentActivities: [
//         { claimId: '1234', message: 'Successfully submitted on 10/01/2024' },
//         { claimId: '1235', message: 'In progress, awaiting document verification' },
//         { claimId: '1236', message: 'Report available for download' },
//     ],
//     notifications: [
//         { message: 'You have a new update on claim #1234' },
//         { message: 'Your recent medical report has been updated' },
//         { message: 'Reminder: Submit your claim documents by 11/30/2024' },
//     ],
// };

// // Function to fetch data from the database or fallback to static data
// const fetchDataFromDatabase = async (modelName) => {
//     try {
//         if (!mongoose.models[modelName]) {
//             console.log(`Model ${modelName} is not registered. Returning empty array.`);
//             return []; // Return empty array if model is not registered
//         }

//         const model = mongoose.model(modelName);
//         // Fetch data based on whether we expect one document (findOne) or many (find)
//         const data = modelName === 'ClaimSubmission' ? await model.find() : await model.findOne();

//         // Return data if available or fallback to static data if empty
//         return data && (Array.isArray(data) ? data.length : data) ? data : staticData[modelName] || [];
//     } catch (error) {
//         console.error(`Error fetching ${modelName} from database:`, error);
//         return staticData[modelName] || []; // Fallback to static data or empty array in case of error
//     }
// };

// // Routes

// // Claim Status Progress Route
// router.get('/claim-status-progress', async (req, res) => {
//     try {
//         const data = await fetchDataFromDatabase('ClaimStatus');
//         console.log('Claim Status Data:', data);
//         res.status(200).json({ data });
//     } catch (error) {
//         console.error('Error fetching claim status data:', error);
//         res.status(500).json({ error: 'Error fetching claim status data' });
//     }
// });

// // Claim Submissions Route
// router.get('/claim-submissions', async (req, res) => {
//     try {
//         const data = await fetchDataFromDatabase('ClaimSubmission');
//         res.status(200).json({ data });
//     } catch (error) {
//         console.error('Error fetching claim submissions:', error);
//         res.status(500).json({ error: 'Error fetching claim submissions' });
//     }
// });

// // Recent Activities Route
// router.get('/recent-activities', async (req, res) => {
//     try {
//         const data = await fetchDataFromDatabase('RecentActivities');
//         console.log('Recent Activities Data:', data);
//         res.status(200).json({ activities: data });
//     } catch (error) {
//         console.error('Error fetching recent activities:', error);
//         res.status(500).json({ error: 'Error fetching recent activities' });
//     }
// });

// // Notifications Route
// router.get('/notifications', async (req, res) => {
//     try {
//         const data = await fetchDataFromDatabase('Notification');
//         console.log('Notifications Data:', data);
//         res.status(200).json({ notifications: data });
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         res.status(500).json({ error: 'Error fetching notifications' });
//     }
// });

// export default router;



import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// Importing models (ensure the paths are correct)
import ClaimStatus from '../models/ClaimStatus.js'; 
import ClaimSubmission from '../models/ClaimSubmission.js'; 
import RecentActivities from '../models/overviewmodels/RecentActivities.js';
import Notification from '../models/overviewmodels/Notification.js';

// Mock static data
const staticData = {
    claimStatusProgress: [20, 40, 60, 80], // Example static data
    claimSubmissions: [3, 5, 2, 8, 6, 4],
    recentActivities: [
        { claimId: '1234', message: 'Successfully submitted on 10/01/2024' },
        { claimId: '1235', message: 'In progress, awaiting document verification' },
        { claimId: '1236', message: 'Report available for download' },
    ],
    notifications: [
        { message: 'You have a new update on claim #1234' },
        { message: 'Your recent medical report has been updated' },
        { message: 'Reminder: Submit your claim documents by 11/30/2024' },
    ],
};

// Function to fetch data from the database or fallback to static data
const fetchDataFromDatabase = async (modelName) => {
    try {
        if (!mongoose.models[modelName]) {
            console.log(`Model ${modelName} is not registered. Returning empty array.`);
            return []; // Return empty array if model is not registered
        }

        const model = mongoose.model(modelName);
        // Fetch data based on whether we expect one document (findOne) or many (find)
        const data = modelName === 'ClaimSubmission' ? await model.find() : await model.findOne();

        // If data is empty or null, fallback to static data
        if (!data || (Array.isArray(data) && data.length === 0)) {
            console.log(`${modelName} is empty, returning static data.`);
            return staticData[modelName] || [];
        }

        return data;
    } catch (error) {
        console.error(`Error fetching ${modelName} from database:`, error);
        return staticData[modelName] || []; // Fallback to static data or empty array in case of error
    }
};

// Routes

// Claim Status Progress Route
router.get('/claim-status-progress', async (req, res) => {
    try {
        const data = await fetchDataFromDatabase('ClaimStatus');
        console.log('Claim Status Data:', data);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching claim status data:', error);
        res.status(500).json({ error: 'Error fetching claim status data' });
    }
});

// Claim Submissions Route
router.get('/claim-submissions', async (req, res) => {
    try {
        const data = await fetchDataFromDatabase('ClaimSubmission');
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching claim submissions:', error);
        res.status(500).json({ error: 'Error fetching claim submissions' });
    }
});

// Recent Activities Route
router.get('/recent-activities', async (req, res) => {
    try {
        const data = await fetchDataFromDatabase('RecentActivities');
        console.log('Recent Activities Data:', data);
        res.status(200).json({ activities: data });
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({ error: 'Error fetching recent activities' });
    }
});

// Notifications Route
router.get('/notifications', async (req, res) => {
    try {
        const data = await fetchDataFromDatabase('Notification');
        console.log('Notifications Data:', data);
        res.status(200).json({ notifications: data });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

export default router;
