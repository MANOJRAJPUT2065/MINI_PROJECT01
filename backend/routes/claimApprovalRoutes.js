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

// Route: Approve a claim
router.post('/approve', async (req, res) => {
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
      // Update the status in the database
      claim.status = approvalStatus;
      claim.auditTrail.push({
        action: `Claim ${approvalStatus}`,
        timestamp: new Date().toLocaleString(),
      });

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

export default router;