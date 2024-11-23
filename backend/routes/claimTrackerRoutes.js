// routes/claimTrackerRoutes.js
import express from 'express';
import { getClaimStatus } from '../controllers/claimTrackerController.js';

const router = express.Router();

// Fetch claim status by claimId
router.get('/:claimId', getClaimStatus);

export default router;
