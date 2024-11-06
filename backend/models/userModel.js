import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin','insurer'],
        default: 'user',
    },
    blockchainWallet: { type: String, required: false },
    reports: [
        {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
            description: { type: String }
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
