// complete this whole part
import express from 'express';
import { getAdminProfile } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getAdminProfile);

export default router;
