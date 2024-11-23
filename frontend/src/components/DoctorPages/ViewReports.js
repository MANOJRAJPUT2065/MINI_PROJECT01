import React, { useState, useEffect } from 'react';

function ViewReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null)

    useEffect(() => {
        // Simulating fetching reports from an API
        const mockReports = [
            {
                _id: '1',
                reportUrl: 'https://example.com/report1.pdf',
                uploadedAt: '2024-11-10T12:34:00Z',
            },
            {
                _id: '2',
                reportUrl: 'https://example.com/report2.pdf',
                uploadedAt: '2024-11-12T08:21:00Z',
            },
            {
                _id: '3',
                reportUrl: 'https://example.com/report3.pdf',
                uploadedAt: '2024-11-15T10:40:00Z',
            },
        ];

        setReports(mockReports);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-8 animate-pulse">
                <div className="spinner-border text-teal-500" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="ml-4">Loading reports...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 mt-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-r from-teal-100 to-teal-300 rounded-xl shadow-lg">
            <h2 className="text-4xl font-bold text-teal-800 mb-6 text-center animate-fade-in">
                View Reports
            </h2>
            {reports.length === 0 ? (
                <p className="text-center text-xl text-teal-600">No reports available.</p>
            ) : (
                <table className="min-w-full table-auto border-collapse border border-gray-300 mt-8 rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-teal-600 text-white">
                        <tr>
                            <th className="p-4">Report ID</th>
                            <th className="p-4">Report URL</th>
                            <th className="p-4">Uploaded At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="hover:bg-teal-50 transform transition-all duration-300 ease-in-out hover:scale-105">
                                <td className="p-4 text-center">{report._id}</td>
                                <td className="p-4 text-center">
                                    <a
                                        href={report.reportUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-500 hover:text-teal-700 font-semibold transform transition-all duration-200 ease-in-out hover:underline"
                                    >
                                        View Report
                                    </a>
                                </td>
                                <td className="p-4 text-center">
                                    {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ViewReports;
