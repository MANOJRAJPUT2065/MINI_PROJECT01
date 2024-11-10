import mongoose from 'mongoose';

const InsuranceClaimSchema = new mongoose.Schema({
  claimId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InsuranceClaim = mongoose.model('InsuranceClaim', InsuranceClaimSchema);

export default InsuranceClaim;
