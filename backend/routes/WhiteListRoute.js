import Whitelist from './models/whitelist.js'; // Import the Whitelist model
import User from '../models/userModel.js';
// Add a user to the whitelist
export const addToWhitelist = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already whitelisted
        const isWhitelisted = await Whitelist.findOne({ email });
        if (isWhitelisted) {
            return res.status(400).json({ message: 'User is already whitelisted' });
        }

        // Add the user to the whitelist
        const whitelistEntry = new Whitelist({ email });
        await whitelistEntry.save();

        res.status(201).json({ message: 'User added to whitelist successfully' });
    } catch (error) {
        console.error('Error adding user to whitelist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Check if a user is whitelisted
export const checkWhitelist = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user is in the whitelist
        const isWhitelisted = await Whitelist.findOne({ email });
        if (!isWhitelisted) {
            return res.status(404).json({ message: 'User is not whitelisted' });
        }

        res.status(200).json({ message: 'User is whitelisted' });
    } catch (error) {
        console.error('Error checking whitelist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Remove a user from the whitelist
export const removeFromWhitelist = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user is in the whitelist
        const isWhitelisted = await Whitelist.findOne({ email });
        if (!isWhitelisted) {
            return res.status(404).json({ message: 'User is not in the whitelist' });
        }

        // Remove the user from the whitelist
        await Whitelist.deleteOne({ email });

        res.status(200).json({ message: 'User removed from whitelist successfully' });
    } catch (error) {
        console.error('Error removing user from whitelist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
