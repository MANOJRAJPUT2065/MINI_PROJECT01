// routes/claimsRoutes.js
import express from 'express';
import { getRejectedClaims, disputeClaim, getAnalytics } from '../controllers/claimsController.js';

const router = express.Router();

// Route for fetching rejected claims
router.get('/rejected', getRejectedClaims);

// Route for submitting a dispute for a claim
router.post('/dispute/:claimId', disputeClaim);

// Route for fetching rejection analytics
router.get('/analytics', getAnalytics);

export default router;
