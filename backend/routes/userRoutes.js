import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'; // Import both functions
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('user/profile', authMiddleware, updateUserProfile); 

export default router;
