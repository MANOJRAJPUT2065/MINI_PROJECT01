// create models for admin

import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
    blockchainWallet: { type: String, required: false }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
// end of admin model