import express from 'express';
import mongoose from 'mongoose';
import DoctorClaim from '../models/DoctorClaim.js';

const router = express.Router();

// Route to submit a new claim
router.post('/submit', async (req, res) => {
    const { doctorId, patientId, diagnosis, treatment, claimAmount } = req.body;

    // Log incoming request data for debugging
    console.log('Received claim data:', req.body);

    // Validate required fields
    if (!doctorId || !patientId || !diagnosis || !treatment || !claimAmount) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate MongoDB ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctorId format' });
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ error: 'Invalid patientId format' });
    }

    // Convert strings to MongoDB ObjectIds using new
    const validDoctorId = new mongoose.Types.ObjectId(doctorId);
    const validPatientId = new mongoose.Types.ObjectId(patientId);

    try {
        const newClaim = new DoctorClaim({
            doctorId: validDoctorId,
            patientId: validPatientId,
            diagnosis,
            treatment,
            claimAmount,
            status: 'Pending',
        });

        console.log('Saving new claim:', newClaim); // Log the claim before saving

        // Save the claim to the database
        await newClaim.save();

        // Return success response
        res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
    } catch (error) {
        console.error('Error while saving claim:', error); // Log the error details
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

export default router;
