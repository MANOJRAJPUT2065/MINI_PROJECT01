// src/components/DoctorDashboard/ClaimSubmission.js
import React, { useState } from 'react';

const ClaimSubmission = () => {
    const [claimData, setClaimData] = useState({
        diagnosis: '',
        treatment: '',
        claimAmount: '',
    });

    const handleSubmit = () => {
        // Simulating a claim submission process
        console.log('Submitting claim:', claimData);
        alert('Claim submitted successfully!');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Claim Submission</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label className="block text-gray-700">Diagnosis</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={claimData.diagnosis}
                        onChange={(e) => setClaimData({ ...claimData, diagnosis: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Treatment</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={claimData.treatment}
                        onChange={(e) => setClaimData({ ...claimData, treatment: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Claim Amount</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={claimData.claimAmount}
                        onChange={(e) => setClaimData({ ...claimData, claimAmount: e.target.value })}
                    />
                </div>
                <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Submit Claim
                </button>
            </form>
        </div>
    );
};

export default ClaimSubmission;
