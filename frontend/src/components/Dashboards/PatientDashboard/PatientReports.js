import React from 'react';

const PatientReports = () => {
    const reports = [
        { id: 101, date: '2024-11-01', type: 'Blood Test', comments: 'Normal range observed' },
        { id: 102, date: '2024-11-05', type: 'X-Ray', comments: 'Minor fracture in left arm' },
        { id: 103, date: '2024-11-10', type: 'MRI', comments: 'No abnormalities detected' },
    ];

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
                        {reports.map((report) => (
                            <tr
                                key={report.id}
                                className="hover:bg-gray-100 transition duration-200"
                            >
                                <td className="p-4 border border-gray-300">{report.id}</td>
                                <td className="p-4 border border-gray-300">{report.date}</td>
                                <td className="p-4 border border-gray-300">{report.type}</td>
                                <td className="p-4 border border-gray-300">{report.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientReports;
