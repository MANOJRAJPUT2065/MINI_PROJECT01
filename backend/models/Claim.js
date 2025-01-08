import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const claimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    patientName: { type: String, required: true },
    doctorName: { type: String },
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rejectionDate: {
      type: Date,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['under review', 'approved', 'rejected', 'pending'],
    },
    disputeMessage: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    documents: [
      {
        fileUrl: {
          type: String,
          required: true,
        },
        ipfsHash: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
    submissions: [
      {
        type: Date,
        default: Date.now,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index frequently queried fields
claimSchema.index({ claimId: 1 }, { unique: true });
claimSchema.index({ status: 1 });
claimSchema.index({ patientId: 1 });

// Add virtual field for computed properties
claimSchema.virtual('statusLabel').get(function () {
  const statusLabels = {
    'under review': 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
  };
  return statusLabels[this.status] || 'Unknown';
});

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
