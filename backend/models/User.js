import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'approver', 'auditor', 'user'], default: 'user' },
    blockchainWallet: { type: String },
  },
  { timestamps: true }
);

const Users = mongoose.model('Users', userSchema);

export default Users;
