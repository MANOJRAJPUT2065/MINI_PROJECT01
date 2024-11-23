import React from 'react';

const TrackClaims = () => {
    const claims = [
        { id: 1, policyNumber: 'POL12345', status: 'Pending', date: '2024-11-10' },
        { id: 2, policyNumber: 'POL54321', status: 'Approved', date: '2024-11-12' },
        { id: 3, policyNumber: 'POL98765', status: 'Rejected', date: '2024-11-15' },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-teal-600">Track Claim Status</h1>
            <p className="mt-4 text-gray-700">
                View and track the status of your insurance claims here.
            </p>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-teal-500 text-white">
                            <th className="p-4 border border-gray-300">Claim ID</th>
                            <th className="p-4 border border-gray-300">Policy Number</th>
                            <th className="p-4 border border-gray-300">Status</th>
                            <th className="p-4 border border-gray-300">Submission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim) => (
                            <tr
                                key={claim.id}
                                className="hover:bg-gray-100 transition duration-200"
                            >
                                <td className="p-4 border border-gray-300">{claim.id}</td>
                                <td className="p-4 border border-gray-300">{claim.policyNumber}</td>
                                <td
                                    className={`p-4 border border-gray-300 ${
                                        claim.status === 'Approved'
                                            ? 'text-green-600'
                                            : claim.status === 'Rejected'
                                            ? 'text-red-600'
                                            : 'text-yellow-600'
                                    }`}
                                >
                                    {claim.status}
                                </td>
                                <td className="p-4 border border-gray-300">{claim.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackClaims;
