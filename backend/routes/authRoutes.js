// import express from 'express';
// import { loginUser, registerUser } from '../controllers/authController.js';

// const router = express.Router();

// router.post('/login', loginUser);
// router.post('/register', registerUser);
// router.post('/logout',logOutUser)

// export default router;


// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, logOutUser, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Logout Route
router.post('/logout', logOutUser);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password', resetPassword);

export default router;
