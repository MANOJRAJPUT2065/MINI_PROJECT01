import React, { useState, useEffect } from 'react';

// Simulated blockchain transaction function
const getBlockchainTransaction = (claimId) => {
  // In a real-world app, this would interact with a blockchain API
  return {
    status: 'Transaction Pending',
    transactionHash: `0x${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toLocaleString(),
  };
};

// Example of claim data
const initialClaims = [
  { id: 1, title: 'Claim 001', status: 'Under Review', createdAt: '2024-11-01' },
  { id: 2, title: 'Claim 002', status: 'Requires Documentation', createdAt: '2024-11-03' },
  { id: 3, title: 'Claim 003', status: 'Approval Pending', createdAt: '2024-11-05' },
];

const PendingClaims = () => {
  const [claims, setClaims] = useState(initialClaims);
  const [blockchainInfo, setBlockchainInfo] = useState({});

  // Simulate fetching blockchain info when a claim status is updated
  const handleAction = (claimId, action) => {
    // Update claim status
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === claimId ? { ...claim, status: action } : claim
      )
    );

    // Simulate blockchain update for the claim
    const transaction = getBlockchainTransaction(claimId);
    setBlockchainInfo((prev) => ({ ...prev, [claimId]: transaction }));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600">Pending Claims</h2>
      <div className="mt-4 space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="border p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold">{claim.title}</h3>
            <p>Status: <span className="text-gray-700">{claim.status}</span></p>
            <p className="text-sm text-gray-500">Created on: {claim.createdAt}</p>
            
            {/* Action Buttons */}
            <div className="mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleAction(claim.id, 'Approved')}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handleAction(claim.id, 'Rejected')}
              >
                Reject
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded"
                onClick={() => handleAction(claim.id, 'More Info Requested')}
              >
                Request More Info
              </button>
            </div>

            {/* Blockchain Transparency */}
            {blockchainInfo[claim.id] && (
              <div className="mt-4 p-2 border bg-gray-100 rounded">
                <p><strong>Blockchain Status:</strong> {blockchainInfo[claim.id].status}</p>
                <p><strong>Transaction Hash:</strong> {blockchainInfo[claim.id].transactionHash}</p>
                <p><strong>Timestamp:</strong> {blockchainInfo[claim.id].timestamp}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingClaims;
