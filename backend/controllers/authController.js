import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';


export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, role, blockchainWallet } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Email validation (checks if it ends with @gmail.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid Gmail address (ending with @gmail.com)' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        blockchainWallet,
    });

    // Save the user
    const savedUser = await user.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
};




export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Email validation (checks if it ends with @gmail.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid Gmail address (ending with @gmail.com)' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Optional: You can validate the user's role if needed
    if (user.role !== role) {
        return res.status(403).json({ message: 'Role does not match' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with the token and user info
    res.json({ token, user });
};



 

// Forgot Password

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Email validation (checks if it ends with @gmail.com)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid Gmail address (ending with @gmail.com)' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User with this email does not exist' });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create transporter to send reset email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
        // Send email with the reset link
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
        });
        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid token or token expired' });
    }
};
 
// Create logic for logOut
export const logOutUser = async (req, res) => {
    try {
        // Clear the token from the client-side (e.g., using localStorage)
        res.clearCookie('token'); // Assuming you're using cookies for authentication
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};