// // models/Claim.js
// import mongoose from 'mongoose';

// const claimSchema = new mongoose.Schema({
//   patientName: { type: String, required: true },
//   amount: { type: Number, required: true },
//   rejectionReason: { type: String, required: true },
//   rejectionDate: { type: Date, required: true },
//   status: { type: String, default: 'rejected' },  // Can be 'rejected', 'under review', etc.
//   disputeMessage: { type: String, default: '' },
//   notes: { type: String }
// }, { timestamps: true });

// const Claim = mongoose.model('Claim', claimSchema);

// export default Claim;


// models/Claim.js
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    doctorName: { type: String }, // Optional, for doctor-specific details
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the patient
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the doctor
    amount: { type: Number, required: true },
    rejectionReason: { type: String, default: '' },
    rejectionDate: { type: Date },
    status: { type: String, default: 'under review' }, // 'rejected', 'approved', etc.
    disputeMessage: { type: String, default: '' },
    notes: { type: String, default: '' },
    documents: [
        {
            fileUrl: { type: String }, // URL to the document
            ipfsHash: { type: String }, // IPFS hash for the document
            fileType: { type: String } // e.g., 'pdf', 'jpg', etc.
        }
    ]
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
