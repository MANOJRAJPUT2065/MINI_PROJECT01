import React, { useState } from 'react';

const PatientReports = () => {
  // Initial reports (mock data for now)
  const [reports, setReports] = useState([
    { id: 101, date: '2024-11-01', type: 'Blood Test', comments: 'Normal range observed' },
    { id: 102, date: '2024-11-05', type: 'X-Ray', comments: 'Minor fracture in left arm' },
    { id: 103, date: '2024-11-10', type: 'MRI', comments: 'No abnormalities detected' },
  ]);

  // State for the new report to be uploaded
  const [newReport, setNewReport] = useState({
    id: '',
    date: '',
    type: '',
    comments: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add the new report to the existing reports list
    setReports((prevReports) => [
      ...prevReports,
      { ...newReport, id: prevReports.length + 101 }, // Generate new ID
    ]);

    // Clear the input fields
    setNewReport({ id: '', date: '', type: '', comments: '' });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-teal-600">Patient Reports</h1>
      <p className="mt-4 text-gray-700">
        View your medical reports with detailed insights and doctor's comments.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-teal-500 text-white">
              <th className="p-4 border border-gray-300">Report ID</th>
              <th className="p-4 border border-gray-300">Date</th>
              <th className="p-4 border border-gray-300">Type</th>
              <th className="p-4 border border-gray-300">Doctor's Comments</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No reports available.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="p-4 border border-gray-300">{report.id}</td>
                  <td className="p-4 border border-gray-300">{report.date}</td>
                  <td className="p-4 border border-gray-300">{report.type}</td>
                  <td className="p-4 border border-gray-300">{report.comments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Report Upload Form */}
      <h2 className="text-xl font-semibold text-teal-600 mt-6">Upload New Report</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={newReport.date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
            Report Type
          </label>
          <input
            type="text"
            name="type"
            value={newReport.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comments" className="block text-gray-700 font-medium mb-2">
            Doctor's Comments
          </label>
          <input
            type="text"
            name="comments"
            value={newReport.comments}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white py-2 px-4 rounded-md"
        >
          Upload Report
        </button>
      </form>
    </div>
  );
};

export default PatientReports;
