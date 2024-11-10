// import express from 'express';
// import { getInsuranceClaimStatus } from '../controllers/insuranceController.js';

// const router = express.Router();

// // Route to check the claim status using raw claimId
// router.get('/:claimId', getInsuranceClaimStatus);

// export default router;


import express from 'express';
import { getInsuranceClaimStatus } from '../controllers/insuranceController.js';

const router = express.Router();

// Route to check the claim status using raw claimId
router.get('/:claimId', getInsuranceClaimStatus);

export default router;
