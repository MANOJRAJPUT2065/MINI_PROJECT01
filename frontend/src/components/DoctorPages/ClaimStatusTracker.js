import React, { useState } from 'react';

const ClaimStatusTracker = () => {
    const [claimId, setClaimId] = useState('');
    const [status, setStatus] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // For error handling

    // Function to track claim status via backend API
    const handleTrackStatus = async () => {
        if (!claimId) {
            alert('Please enter a claim ID.');
            return;
        }

        setLoading(true);
        setError(null); // Reset error before making a new request

        try {
            // Fetch the claim status from the backend API
            const response = await fetch(`http://localhost:5000/api/claim-tracker/${claimId}`);

            if (!response.ok) {
                // Handle non-2xx responses
                throw new Error('Claim not found or server error');
            }

            const data = await response.json();

            if (data.status) {
                // Set the status and add it to the history
                const newStatus = {
                    status: data.status,
                    timestamp: new Date(),
                };

                setStatus(data.status);
                setStatusHistory([newStatus, ...statusHistory]); // Add to the history
            } else {
                alert('Claim not found!');
            }
        } catch (error) {
            console.error('Error fetching claim status:', error);
            setError('Error fetching claim status. Please try again.');
        }

        setLoading(false);
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
            <button
                onClick={handleTrackStatus}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                disabled={loading}
            >
                {loading ? 'Tracking...' : 'Track Status'}
            </button>

            {error && (
                <div className="mt-4 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {status && !loading && (
                <div className="mt-4">
                    <p className="font-bold">Current Claim Status:</p>
                    <p>{status}</p>
                </div>
            )}

            {statusHistory.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold">Claim Status History:</h3>
                    <ul className="list-disc ml-6">
                        {statusHistory.map((log, index) => (
                            <li key={index} className="text-sm">
                                <span className="font-medium">
                                    {new Date(log.timestamp).toLocaleString()}:
                                </span> {log.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ClaimStatusTracker;
