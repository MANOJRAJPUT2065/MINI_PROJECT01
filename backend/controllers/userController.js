import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

// Fetch User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;

    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (password) userFields.password = await bcrypt.hash(password, 10);

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
