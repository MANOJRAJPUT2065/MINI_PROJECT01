// routes/activityLogRoutes.js
import express from 'express';
import ActivityLog from '../models/activityLogModel.js';  // Update model import if needed

const router = express.Router();

// Route to fetch all activity logs
router.get('/', async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find().sort({ timestamp: -1 }); // Sort by latest timestamp
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error });
  }
});

// Route to add a new activity log (e.g., user activity)
router.post('/', async (req, res) => {
  try {
    const { action, user } = req.body;
    const newLog = new ActivityLog({ action, user });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity log', error });
  }
});

export default router;
