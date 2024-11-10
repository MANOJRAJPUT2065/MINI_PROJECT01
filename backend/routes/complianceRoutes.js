import express from 'express';
import Compliance from '../models/Compliance.js';  // Use ESM import

const router = express.Router();

// Get all compliance features
router.get('/', async (req, res) => {
  try {
    const complianceFeatures = await Compliance.find();
    res.json(complianceFeatures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching compliance data' });
  }
});

// Create a new compliance feature (for example, adding new rules)
router.post('/', async (req, res) => {
  const { feature, description, isCompliant } = req.body;

  try {
    const newCompliance = new Compliance({ feature, description, isCompliant });
    await newCompliance.save();
    res.status(201).json(newCompliance);
  } catch (error) {
    res.status(400).json({ message: 'Error adding new compliance feature' });
  }
});

export default router;   
