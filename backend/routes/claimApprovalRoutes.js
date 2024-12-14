import express from 'express';
import Claim from '../models/Claim.js'; // Model for claim details
import { approveClaimOnBlockchain } from './contractFunctions.js'; // Smart contract interaction function
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to handle ObjectId validation
const validateObjectId = (id, res, fieldName) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    res.status(400).json({ message: `Invalid ${fieldName} provided.` });
    throw new Error(`Invalid ${fieldName}`);
  }
};

// Route: Fetch all approved claims
router.get('/claims/approve', async (req, res) => {
  try {
    const approvedClaims = await Claim.find({ status: 'approved' });
    if (approvedClaims.length === 0) {
      return res.status(404).json({ message: 'No approved claims found' });
    }
    res.status(200).json(approvedClaims);
  } catch (error) {
    console.error('Error fetching approved claims:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: Approve a claim
router.post('/claims/approve', async (req, res) => {
  console.log("Inside Approving claim... route");
  console.log("Incoming request body:", req.body);

  const { claimId, doctorId, approvalStatus } = req.body;
  if (!claimId || !doctorId || !approvalStatus) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Step 1: Validate the claimId and doctorId
    const claimObjectId = validateObjectId(claimId, res, 'claimId');
    const doctorObjectId = validateObjectId(doctorId, res, 'doctorId');

    // Step 2: Find the claim
    const claim = await Claim.findById(claimObjectId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Step 3: Validate the doctor’s authorization
    if (!claim.doctorId.equals(doctorObjectId)) {
      return res.status(403).json({ message: 'Unauthorized to approve this claim' });
    }

    // Step 4: Validate the claim status
    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Claim is already processed' });
    }

    // Step 5: Interact with the blockchain
    const approvalResult = await approveClaimOnBlockchain(claimId, approvalStatus);

    if (approvalResult.success) {
      claim.status = approvalStatus;
      await claim.save();

      return res.status(200).json({ message: 'Claim successfully approved', claim });
    } else {
      return res.status(400).json({ message: 'Error approving the claim on blockchain' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: Fetch claim by ID
router.get('/claims/:id', async (req, res) => {
  try {
    const claimId = validateObjectId(req.params.id, res, 'claimId');
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error fetching claim by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: Fetch all claims for a doctor
router.get('/claims/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = validateObjectId(req.params.doctorId, res, 'doctorId');
    const claims = await Claim.find({ doctorId });
    if (claims.length === 0) {
      return res.status(404).json({ message: 'No claims found for the specified doctor' });
    }
    res.status(200).json(claims);
  } catch (error) {
    console.error('Error fetching claims for doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: Fetch all claims
router.get('/claims', async (req, res) => {
  try {
    const claims = await Claim.find({});
    if (claims.length === 0) {
      return res.status(404).json({ message: 'No claims found' });
    }
    res.status(200).json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
