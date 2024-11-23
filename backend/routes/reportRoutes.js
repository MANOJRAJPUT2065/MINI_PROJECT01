import express from 'express';
import xlsx from 'xlsx';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for email sending
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many email requests. Please try again later.' },
});

// Helper function to generate reports based on format
const generateReport = async (reportType, format) => {
    // Replace with dynamic fetch from database
    const claimsData = [
        { patient: 'John Doe', amount: 1000, status: 'approved',       provider: 'Provider A' },
        { patient: 'Jane Smith', amount: 500, status: 'rejected', provider: 'Provider B' },
    ];

    // Generate reports based on format (same logic as before)
    if (format === 'CSV') {
        const ws = xlsx.utils.json_to_sheet(claimsData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Claims Report');
        return xlsx.write(wb, { bookType: 'csv', type: 'buffer' });
    }

    if (format === 'Excel') {
        const ws = xlsx.utils.json_to_sheet(claimsData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Claims Report');
        return xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
    }

    if (format === 'PDF') {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffer = [];
            doc.on('data', (chunk) => buffer.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffer)));
            doc.on('error', (err) => reject(err));
            doc.fontSize(12).text('Claims Report', { align: 'center' });
            claimsData.forEach((claim) => doc.text(`Patient: ${claim.patient}, Amount: ${claim.amount}, Status: ${claim.status}`));
            doc.end();
        });
    }

    return null;
};

// Generate Report Route
router.post('/generate', async (req, res) => {
    const { reportType, format } = req.body;

    if (!reportType || !format) {
        return res.status(400).json({ error: 'Missing reportType or format in request.' });
    }

    try {
        const reportBuffer = await generateReport(reportType, format);
        if (!reportBuffer) {
            return res.status(500).json({ error: 'Error generating the report' });
        }

        res.setHeader('Content-Type', format === 'PDF' ? 'application/pdf' : 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report.${format.toLowerCase()}"`);
        res.send(reportBuffer);
    } catch (error) {
        console.error('Error generating the report:', error);
        res.status(500).json({ error: 'Error generating the report' });
    }
});

// Send Email Route
router.post('/send-email', emailLimiter, async (req, res) => {
    const { reportType, format, email } = req.body;

    if (!email || !reportType || !format) {
        return res.status(400).json({ error: 'Missing email, reportType, or format in request.' });
    }

    try {
        const reportBuffer = await generateReport(reportType, format);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `${reportType} Report`,
            text: 'Please find the attached report.',
            attachments: [{ filename: `${reportType}_report.${format.toLowerCase()}`, content: reportBuffer }],
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

export default router;
