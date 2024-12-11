

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

const claimSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    doctorName: { type: String }, // Optional, for doctor-specific details
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the patient
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the doctor
    amount: { type: Number, required: true, min: 0 }, // Ensuring amount is a positive number
    rejectionReason: { type: String, default: '' },
    rejectionDate: { type: Date },
    status: { type: String, default: 'under review', enum: ['under review', 'approved', 'rejected', 'pending'] }, // Restricting to specific status values
    disputeMessage: { type: String, default: '' },
    notes: { type: String, default: '' },
    documents: [
        {
            fileUrl: { type: String, required: true }, // Added required to ensure document URL is provided
            ipfsHash: { type: String, required: true }, // IPFS hash required
            fileType: { type: String, required: true } // e.g., 'pdf', 'jpg', etc.
        }
    ]
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
