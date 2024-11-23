// components/DoctorPages/ManageClaims.js
import React, { useState, useEffect } from 'react';

function ManageClaims() {
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        // Simulating API call or fetching dummy data
        const fetchedClaims = [
            { id: 1, claimStatus: 'Pending', patient: 'John Doe' },
            { id: 2, claimStatus: 'Approved', patient: 'Jane Smith' },
            { id: 3, claimStatus: 'Rejected', patient: 'Alice Brown' },
        ];
        setClaims(fetchedClaims);
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-teal-600 mb-6">Manage Claims</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {claims.map((claim) => (
                    <div
                        key={claim.id}
                        className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                        <p className="text-lg font-semibold text-gray-800">
                            Patient: <span className="text-teal-600">{claim.patient}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Status: 
                            <span
                                className={`ml-2 px-2 py-1 rounded-full text-white ${
                                    claim.claimStatus === 'Approved'
                                        ? 'bg-green-500'
                                        : claim.claimStatus === 'Pending'
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}
                            >
                                {claim.claimStatus}
                            </span>
                        </p>
                        <button
                            className="mt-4 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageClaims;
