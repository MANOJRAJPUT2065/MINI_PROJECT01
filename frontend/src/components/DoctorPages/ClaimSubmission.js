import React, { useState } from 'react';
import axios from 'axios';

const ClaimSubmission = () => {
    const [claimData, setClaimData] = useState({
        doctorId: '',
        patientId: '',
        diagnosis: '',
        treatment: '',
        claimAmount: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log the data to verify before submission
        console.log('Submitting claim:', claimData);

        // Basic validation to check if required fields are filled
        if (!claimData.doctorId || !claimData.patientId || !claimData.diagnosis || !claimData.treatment || !claimData.claimAmount) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/claims/submit', claimData);
            console.log('Claim submitted:', response.data);
            alert('Claim submitted successfully!');
        } catch (error) {
            console.error('Error submitting claim:', error);
            alert('Failed to submit claim. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Claim Submission</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Doctor ID</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={claimData.doctorId}
                        onChange={(e) => setClaimData({ ...claimData, doctorId: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Patient ID</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={claimData.patientId}
                        onChange={(e) => setClaimData({ ...claimData, patientId: e.target.value })}
                    />
                </div>
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
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Submit Claim
                </button>
            </form>
        </div>
    );
};

export default ClaimSubmission;
