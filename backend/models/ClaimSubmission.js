import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const claimSubmissionSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4, // Automatically generate claimId using uuid
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
      default: 'under review',
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
      },
    ],
    progress: {
      type: Number,
      default: 0, // For tracking claim progress as a percentage or stage
    },
    submissions: [
      {
        type: Date,
        default: Date.now, // Store submission timestamps for each claim update
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
const ClaimSubmission = mongoose.model('ClaimSubmission', claimSubmissionSchema);

export default ClaimSubmission;
