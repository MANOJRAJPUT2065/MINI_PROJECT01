// // routes/uploadRoutes.js
// import express from 'express';
// import cloudinary from 'cloudinary';
// import multer from 'multer';
// import Report from '../models/Report.js'
// const   router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Cloudinary config
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
// });










// // Upload image to Cloudinary
// router.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         const stream = cloudinary.v2.uploader.upload_stream(
//             { folder: 'uploads/images' }, // Store images in a separate folder
//             (error, result) => {
//                 if (error) {
//                     return res.status(500).json({ error: error.message || 'Upload failed' });
//                 }
//                 res.json(result);
//                 console.log(res);
//             }
//         );
//         stream.end(req.file.buffer);
//         console.log('Image uploaded to Cloudinary');
//     } catch (error) {
//         res.status(500).json({ error: error.message || 'An error occurred during upload' });
//     }
// });



// // Upload report to Cloudinary
// // router.post('/upload-report', upload.single('report'), async (req, res) => {
// //     try {
// //         const stream = cloudinary.v2.uploader.upload_stream(
// //             { folder: 'uploads/reports' }, // Store reports in a separate folder
// //             (error, result) => {
// //                 if (error) {
// //                     return res.status(500).json({ error: error.message || 'Upload failed' });
// //                 }
// //                 res.json(result);
// //             }
// //         );
// //         stream.end(req.file.buffer);
// //         console.log('Report uploaded to Cloudinary');
// //     } catch (error) {
// //         res.status(500).json({ error: error.message || 'An error occurred during upload' });
// //     }
// // });

// // Upload report to Cloudinary and save the URL to the database
// router.post('/upload-report', upload.single('report'), async (req, res) => {
//     try {
//         const stream = cloudinary.v2.uploader.upload_stream(
//             { folder: 'uploads/reports', resource_type: 'raw' }, // Ensure resource_type is 'raw'
//             async (error, result) => {
//                 if (error) {
//                     return res.status(500).json({ error: error.message || 'Upload failed' });
//                 }

//                 const newReport = new Report({
//                     reportUrl: result.secure_url, // Save Cloudinary URL
//                     publicId: result.public_id,    // Store the public ID for future reference
//                 });

//                 await newReport.save(); // Save to MongoDB

//                 res.json(newReport); 
//                 console.log('Report uploaded to Cloudinary and saved to database');
//             }
//         );
//         stream.end(req.file.buffer);
//     } catch (error) {
//         res.status(500).json({ error: error.message || 'An error occurred during upload' });
//     }
// });


// // Route to fetch all reports
// // router.get('/reports', async (req, res) => {
// //     try {
// //         const reports = await Report.find({});
        
// //         console.log("Report Fetch SuccessFully from cloudinary")
// //         res.json(reports);

// //     } catch (error) {
// //         res.status(500).json({ error: error.message || 'Failed to fetch reports' });
// //     }
// // });


// // Route to fetch all reports
// router.get('/reports', async (req, res) => {
//     try {
//         const reports = await Report.find({}); // Retrieve all reports
//         console.log("Reports fetched successfully from the database");
//         res.json(reports); 
//     } catch (error) {
//         res.status(500).json({ error: error.message || 'Failed to fetch reports' });
//     }
// });


// export default router;



// routes/uploadRoutes.js
import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Report from '../models/Report.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Route to upload a report directly to Cloudinary
router.post('/upload-report', upload.single('report'), async (req, res) => {
    try {
        const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'uploads/reports' },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message || 'Upload failed' });
                }

                // Save the Cloudinary URL and public ID in MongoDB without local storage
                const newReport = new Report({
                    reportUrl: result.secure_url, // Use Cloudinary URL
                    publicId: result.public_id,
                });

                await newReport.save();
                res.json(newReport); // Respond with the saved report
            }
        );
        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred during upload' });
    }
});



// routes/uploadRoutes.js

// Route to fetch all reports from MongoDB
router.get('/reports', async (req, res) => {
    try {
        // Fetch all reports with Cloudinary URLs from the database
        const reports = await Report.find({});

        // Send back the reports with Cloudinary URLs
        res.json(reports);
        console.log("Reports fetched successfully from the database");
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch reports' });
    }
});

 


// Upload image to Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'uploads/images' }, // Store images in a separate folder
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message || 'Upload failed' });
                }
                res.json(result);
                console.log(res);
            }
        );
        stream.end(req.file.buffer);
        console.log('Image uploaded to Cloudinary');
    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred during upload' });
    }
});


export default router;
