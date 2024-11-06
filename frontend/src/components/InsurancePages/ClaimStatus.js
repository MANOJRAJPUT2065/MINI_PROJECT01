// Generate for Insurance claim status
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClaimStatus = () => {
    const [claimId, setClaimId] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch claim status on component mount (optional)
        // You might want to fetch the claim status based on a user's claims
        // or if a claim ID is passed as a prop
    }, []);

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStatus('');

        try {
            const response = await axios.get(`/api/claims/${claimId}`); // Replace with your API endpoint
            setStatus(response.data.status);
        } catch (error) {
            setError(error.response?.data?.message || 'Error checking claim status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleCheckStatus}>
                <div className="mb-4">
                    <label htmlFor="claimId" className="block text-gray-700 font-bold mb-2">Claim ID:</label>
                    <input
                        type="text"
                        id="claimId"
                        value={claimId}
                        onChange={(e) => setClaimId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Check Status'}
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {status && <p className="text-green-500 mt-2">Claim Status: {status}</p>}
        </div>
    );
};

export default ClaimStatus;