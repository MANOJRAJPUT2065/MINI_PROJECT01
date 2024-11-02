// routes/uploadRoutes.js
import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
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
            }
        );
        stream.end(req.file.buffer);
        console.log('Image uploaded to Cloudinary');
    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred during upload' });
    }
});

// Upload report to Cloudinary
router.post('/upload-report', upload.single('report'), async (req, res) => {
    try {
        const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'uploads/reports' }, // Store reports in a separate folder
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message || 'Upload failed' });
                }
                res.json(result);
            }
        );
        stream.end(req.file.buffer);
        console.log('Report uploaded to Cloudinary');
    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred during upload' });
    }
});

export default router;
