

// // // models/Claim.js
// // import mongoose from 'mongoose';

// // const claimSchema = new mongoose.Schema({
// //     patientName: { type: String, required: true },
// //     doctorName: { type: String }, // Optional, for doctor-specific details
// //     patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the patient
// //     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the doctor
// //     amount: { type: Number, required: true },
// //     rejectionReason: { type: String, default: '' },
// //     rejectionDate: { type: Date },
// //     status: { type: String, default: 'under review' }, // 'rejected', 'approved', etc.
// //     disputeMessage: { type: String, default: '' },
// //     notes: { type: String, default: '' },
// //     documents: [
// //         {
// //             fileUrl: { type: String }, // URL to the document
// //             ipfsHash: { type: String }, // IPFS hash for the document
// //             fileType: { type: String } // e.g., 'pdf', 'jpg', etc.
// //         }
// //     ]
// // }, { timestamps: true });

// // const Claim = mongoose.model('Claim', claimSchema);

// // export default Claim;



// import mongoose from 'mongoose';

// const claimSchema = new mongoose.Schema({
//     patientName: { type: String, required: true },
//     doctorName: { type: String }, // Optional, for doctor-specific details
//     patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the patient
//     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the doctor
//     amount: { type: Number, required: true },
//     rejectionReason: { type: String, default: '' },
//     rejectionDate: { type: Date },
//     status: { type: String, default: 'under review' }, // 'rejected', 'approved', etc.
//     disputeMessage: { type: String, default: '' },
//     notes: { type: String, default: '' },
//     documents: [
//         {
//             fileUrl: { type: String }, // URL to the document
//             ipfsHash: { type: String }, // IPFS hash for the document
//             fileType: { type: String } // e.g., 'pdf', 'jpg', etc.
//         }
//     ]
// }, { timestamps: true });

// const Claim = mongoose.model('Claim', claimSchema);

// export default Claim;



import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true }, // Patient's name (required)
    doctorName: { type: String }, // Doctor's name (optional)
    patientId: { type: String, required: true }, // Ethereum address of the patient (required)
    doctorId: { type: String, required: true }, // Ethereum address of the doctor (required)
    amount: { type: Number, required: true, min: 0 }, // Claim amount (required and must be positive)
    rejectionReason: { type: String, default: '' }, // Reason for rejection (optional)
    rejectionDate: { type: Date }, // Date when the claim was rejected (optional)
    status: {
      type: String,
      default: 'under review',
      enum: ['under review', 'approved', 'rejected', 'pending'], // Restrict to specific status values
    },
    disputeMessage: { type: String, default: '' }, // Message regarding disputes (optional)
    notes: { type: String, default: '' }, // Additional notes (optional)
    documents: [
      {
        fileUrl: { type: String, required: true }, // URL of the file (required)
        ipfsHash: { type: String, required: true }, // IPFS hash for the file (required)
        fileType: { type: String, required: true }, // File type, e.g., 'pdf', 'jpg' (required)
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
