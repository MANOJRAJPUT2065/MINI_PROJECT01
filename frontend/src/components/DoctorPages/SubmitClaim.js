 // Inside components/DoctorPages/SubmitClaim.js
import React, { useState } from 'react';

function SubmitClaim() {
    const [claimData, setClaimData] = useState({
        patientName: '',
        amount: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting claim:', claimData);
        // Add claim submission logic here (e.g., send data to backend API)
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Submit Claim</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Patient Name</label>
                    <input
                        type="text"
                        value={claimData.patientName}
                        onChange={(e) => setClaimData({ ...claimData, patientName: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Claim Amount</label>
                    <input
                        type="number"
                        value={claimData.amount}
                        onChange={(e) => setClaimData({ ...claimData, amount: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Claim Description</label>
                    <textarea
                        value={claimData.description}
                        onChange={(e) => setClaimData({ ...claimData, description: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn-primary">Submit Claim</button>
            </form>
        </div>
    );
}

export default SubmitClaim;
