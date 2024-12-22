import mongoose from 'mongoose';

const whitelistSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email validation
        },
        addedAt: {
            type: Date,
            default: Date.now, // Automatically adds the timestamp when a user is added to the whitelist
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const Whitelist = mongoose.model('Whitelist', whitelistSchema);

export default Whitelist;
