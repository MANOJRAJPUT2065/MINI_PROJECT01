import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [reportFormat, setReportFormat] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle report generation and download
  const handleGenerateReport = async () => {
    if (!reportType || !reportFormat) {
      alert("Please select both report type and format");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/reports/generate', {
        reportType,
        format: reportFormat,
      }, { responseType: 'blob' }); // Set responseType to 'blob' for file download

      // Create a download link for the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);
      link.download = `${reportType}_report.${reportFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      setMessage('Failed to generate the report');
    } finally {
      setLoading(false);
    }
  };

  // Handle email sending
  const handleSendEmail = async () => {
    if (!reportType || !reportFormat || !email) {
      alert("Please select both report type, format, and provide an email address.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/reports/send-email', {
        reportType,
        format: reportFormat,
        email,
      });

      setMessage('Report sent successfully to email!');
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('Failed to send the report via email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600">Reports & Downloads</h2>
      <div className="my-4">
        {/* Report Type Selection */}
        <div>
          <label className="block mb-2">Select Report Type:</label>
          <select
            className="w-full p-2 border border-gray-300"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">-- Select Report Type --</option>
            <option value="claims-performance">Claims Performance</option>
            <option value="approval-rates">Approval Rates</option>
            <option value="payment-timelines">Payment Timelines</option>
            <option value="fraud-detection">Fraud Detection</option>
          </select>
        </div>

        {/* Report Format Selection */}
        <div>
          <label className="block mb-2 mt-4">Select Report Format:</label>
          <select
            className="w-full p-2 border border-gray-300"
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
          >
            <option value="">-- Select Report Format --</option>
            <option value="CSV">CSV</option>
            <option value="Excel">Excel</option>
            <option value="PDF">PDF</option>
          </select>
        </div>

        {/* Email Input Field */}
        <div>
          <label className="block mb-2 mt-4">Enter Email Address:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
          />
        </div>

        {/* Buttons for generating the report and sending email */}
        <div className="mt-4">
          <button
            onClick={handleGenerateReport}
            className="bg-teal-500 text-white p-2 rounded-md mr-4"
            disabled={loading}
          >
            {loading ? 'Generating Report...' : 'Generate Report'}
          </button>

          <button
            onClick={handleSendEmail}
            className="bg-teal-500 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Sending Email...' : 'Send Report via Email'}
          </button>
        </div>

        {/* Message or Feedback */}
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default Reports;
