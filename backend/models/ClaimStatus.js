import mongoose from 'mongoose';
// import Claim from './Claim.js';
const claimStatusSchema = new mongoose.Schema(
  {
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim', // Reference the Claim model
      required: true,
    },
    progress: {
      type: Number,
      default: 0, // Track progress percentage or stage
    },
    submissions: [
      {
        type: Date,
        default: Date.now, // Store submission timestamps for the claim
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ClaimStatus = mongoose.model('ClaimStatus', claimStatusSchema);

export default ClaimStatus;
