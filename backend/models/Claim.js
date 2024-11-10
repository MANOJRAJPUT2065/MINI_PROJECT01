// models/Claim.js
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  amount: { type: Number, required: true },
  rejectionReason: { type: String, required: true },
  rejectionDate: { type: Date, required: true },
  status: { type: String, default: 'rejected' },  // Can be 'rejected', 'under review', etc.
  disputeMessage: { type: String, default: '' },
  notes: { type: String }
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
