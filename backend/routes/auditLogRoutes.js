import express from 'express';
import AuditLog from '../models/AuditLog.js';  // ESM import

const router = express.Router();

// Define routes (GET and POST) here...

router.get('/', async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().sort({ timestamp: -1 });  // Sort by most recent
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

router.post('/', async (req, res) => {
  const { action, performedBy, details } = req.body;

  try {
    const newLog = new AuditLog({ action, performedBy, details });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ message: 'Error creating audit log' });
  }
});

export default router;  // ESM export
