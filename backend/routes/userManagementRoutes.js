import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported for password hashing
import { UserManagement, ActivityLog } from '../models/UserManagement.js';  // Ensure UserManagement is imported correctly
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';  // Middleware to check token and admin role

const router = express.Router();

// Route: Create User (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log(req.body); // To see the incoming data

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists in usermanagement schema' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the User model
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',  // Default to 'user' role
    });

    await newUser.save(); // Save the new user

    // Now create the UserManagement record for this user
    const newUserManagement = new UserManagement({
      user: newUser._id,  // Ensure the user _id is referenced
      role: role || 'user', // Set role for UserManagement
      isActive: true,
    });

    await newUserManagement.save(); // Save user management data

    // Log the activity
    const activityLog = new ActivityLog({
      user: newUser._id,  // Log action under the new user
      action: `User created: ${newUser.firstName} ${newUser.lastName}`,
    });
    await activityLog.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


// Route: Change User Role (Admin only)
router.put('/:userId/role', verifyToken, verifyAdmin, async (req, res) => {
  const { role } = req.body;

  if (!['admin', 'approver', 'auditor', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const userManagement = await UserManagement.findById(req.params.userId);
    if (!userManagement) {
      return res.status(404).json({ message: 'User not found in user management' });
    }

    // Update user role
    userManagement.role = role;
    await userManagement.save();

    // Log the activity
    const activityLog = new ActivityLog({
      user: userManagement._id,
      action: `User role changed to ${role}`,
    });
    await activityLog.save();

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});


// Route: Deactivate User (Admin only)
router.put('/:userId/deactivate', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userManagement = await UserManagement.findById(req.params.userId);

    if (!userManagement) {
      return res.status(404).json({ message: 'User not found in user management' });
    }

    // Deactivate the user account
    userManagement.isActive = false;
    await userManagement.save();

    // Log the activity
    const activityLog = new ActivityLog({
      user: userManagement._id,
      action: `User deactivated: ${userManagement.firstName} ${userManagement.lastName}`,
    });
    await activityLog.save();

    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deactivating user' });
  }
});

// Route: Get All Users (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await UserManagement.find().select('firstName lastName email role isActive');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route: Get Activity Logs (Admin only)
router.get('/activity-log', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate('user', 'firstName lastName email');
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
});

export default router;