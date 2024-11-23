// import express from 'express';
// import mongoose from 'mongoose';
// import DoctorClaim from '../models/DoctorClaim.js';

// const router = express.Router();

// /**
//  * Route to submit a new claim
//  * Endpoint: POST /api/claims/submit
//  */
// router.post('/submit', async (req, res) => {
//     const { doctorId, patientId, diagnosis, treatment, claimAmount } = req.body;

//     console.log('Received claim data:', req.body);

//     // Validate required fields
//     if (!doctorId || !patientId || !diagnosis || !treatment || !claimAmount) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Validate MongoDB ObjectId formats
//     if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
//         return res.status(400).json({ error: 'Invalid doctorId or patientId format' });
//     }

//     try {
//         const newClaim = new DoctorClaim({
//             doctorId: new mongoose.Types.ObjectId(doctorId),
//             patientId: new mongoose.Types.ObjectId(patientId),
//             diagnosis,
//             treatment,
//             claimAmount,
//             status: 'Pending',
//         });

//         console.log('Saving new claim:', newClaim);

//         // Save the claim to the database
//         await newClaim.save();

//         return res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
//     } catch (error) {
//         console.error('Error while saving claim:', error);
//         return res.status(500).json({ error: 'Server error. Please try again later.' });
//     }
// });


// export default router;

import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path'; // Import path module
import DoctorClaim from '../models/DoctorClaim.js';

const router = express.Router();

// Define the storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads'); // Use process.cwd() for absolute path
        cb(null, uploadPath); // Specify the folder where files will be saved
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + file.originalname; // Timestamp-based file naming
        cb(null, fileName);
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage });

// Route to submit a new claim (with file upload)
router.post('/submit', upload.single('report'), async (req, res) => {
    const { doctorId, patientId, diagnosis, treatment, claimAmount } = req.body;
    const report = req.file ? req.file.path : null; // Save file path if uploaded

    // Validate required fields
    if (!doctorId || !patientId || !diagnosis || !treatment || !claimAmount) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate MongoDB ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({ error: 'Invalid doctorId or patientId format' });
    }

    try {
        // Create a new claim with report file path
        const newClaim = new DoctorClaim({
            doctorId: new mongoose.Types.ObjectId(doctorId), // Correct instantiation
            patientId: new mongoose.Types.ObjectId(patientId), // Correct instantiation
            diagnosis,
            treatment,
            claimAmount,
            report, // Attach the file path to the claim
            status: 'Pending' // Default status
        });

        // Save the claim to the database
        await newClaim.save();

        return res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
    } catch (error) {
        console.error('Error while saving claim:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

export default router;
