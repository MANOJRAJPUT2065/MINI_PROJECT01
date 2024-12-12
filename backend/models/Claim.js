

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
    claimId: { type: String, required: true, unique: true },  // Add claimId to schema
    patientName: { type: String, required: true }, 
    doctorName: { type: String },
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    rejectionReason: { type: String, default: '' },
    rejectionDate: { type: Date },
    status: {
      type: String,
      default: 'under review',
      enum: ['under review', 'approved', 'rejected', 'pending'],
    },
    disputeMessage: { type: String, default: '' },
    notes: { type: String, default: '' },
    documents: [
      {
        fileUrl: { type: String, required: true },
        ipfsHash: { type: String, required: true },
        fileType: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
