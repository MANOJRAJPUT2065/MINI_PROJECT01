// create admin controller

import Admin from '../models/Admin.js';

// Fetch Admin Profile
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
    const { name, email, password } = req.body;

    const adminFields = {};
    if (name) adminFields.name = name;
    if (email) adminFields.email = email;
    if (password) adminFields.password = await bcrypt.hash(password, 10);

    try {
        const admin = await Admin.findByIdAndUpdate(req.user.id, { $set: adminFields }, { new: true }).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
