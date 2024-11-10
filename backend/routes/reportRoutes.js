import express from 'express';
import xlsx from 'xlsx';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

const router = express.Router();

// Helper function to generate reports based on format
const generateReport = async (reportType, format) => {
  const claimsData = [
    { patient: 'John Doe', amount: 1000, status: 'approved', provider: 'Provider A' },
    { patient: 'Jane Smith', amount: 500, status: 'rejected', provider: 'Provider B' },
  ];

  // Generate CSV Report
  if (format === 'CSV') {
    const ws = xlsx.utils.json_to_sheet(claimsData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Claims Report');
    const buffer = xlsx.write(wb, { bookType: 'csv', type: 'buffer' });
    return buffer;
  }

  // Generate Excel Report
  if (format === 'Excel') {
    const ws = xlsx.utils.json_to_sheet(claimsData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Claims Report');
    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }

  // Generate PDF Report
  if (format === 'PDF') {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      let buffer = [];

      doc.on('data', (chunk) => {
        buffer.push(chunk);
      });

      doc.on('end', () => {
        const finalBuffer = Buffer.concat(buffer);
        resolve(finalBuffer); // resolve the Promise with the final PDF buffer
      });

      doc.on('error', (err) => {
        reject(err); // handle any errors
      });

      // Document content
      doc.fontSize(12).text('Claims Report', { align: 'center' });
      claimsData.forEach((claim) => {
        doc.text(`Patient: ${claim.patient}, Amount: ${claim.amount}, Status: ${claim.status}`);
      });

      doc.end(); // End the document to trigger the 'end' event
    });
  }

  return null; // if format is not recognized, return null
};

// Route for generating the report
router.post('/generate', async (req, res) => {
  const { reportType, format } = req.body;

  // Validate format and reportType
  if (!reportType || !format) {
    return res.status(400).json({ error: 'Missing reportType or format in request.' });
  }

  try {
    const reportBuffer = await generateReport(reportType, format); // wait for report to be generated

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

// Route for sending the report via email (optional)
router.post('/send-email', async (req, res) => {
  const { reportType, format, email } = req.body;

  // Validate email and report parameters
  if (!email || !reportType || !format) {
    return res.status(400).json({ error: 'Missing email, reportType, or format in request.' });
  }

  try {
    const reportBuffer = await generateReport(reportType, format); // wait for report to be generated

    if (!reportBuffer) {
      return res.status(500).json({ error: 'Error generating the report' });
    }

    // Send the report via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use another service like 'smtp.sendgrid.net'
      auth: {
        user: process.env.EMAIL_USER, // Your email address (e.g., 'youremail@gmail.com')
        pass: process.env.EMAIL_PASS, // Your email password or App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${reportType} Report`,
      text: 'Please find the attached report.',
      attachments: [
        {
          filename: `${reportType}_report.${format.toLowerCase()}`,
          content: reportBuffer,
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

export default router;
