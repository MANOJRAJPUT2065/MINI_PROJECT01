// src/components/DoctorDashboard/ClaimStatusTracker.js
import React, { useState } from 'react';

const ClaimStatusTracker = () => {
    const [claimId, setClaimId] = useState('');
    const [status, setStatus] = useState(null);

    const handleTrackStatus = () => {
        // Simulate tracking claim status
        setStatus('Claim Approved');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Track Claim Status</h2>
            <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter Claim ID"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
            />
            <button onClick={handleTrackStatus} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Track Status
            </button>
            {status && <p className="mt-4">Claim Status: {status}</p>}
        </div>
    );
};

export default ClaimStatusTracker;
