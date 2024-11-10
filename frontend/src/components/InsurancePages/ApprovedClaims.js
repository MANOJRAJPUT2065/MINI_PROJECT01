import React, { useState } from 'react';

// Simulated blockchain transaction and payment functions
const getBlockchainTransaction = (claimId) => {
  // In a real-world app, this would interact with a blockchain API
  return {
    status: 'Transaction Successful',
    transactionHash: `0x${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toLocaleString(),
  };
};

// Example of approved claim data
const initialApprovedClaims = [
  {
    id: 1,
    title: 'Claim 001',
    approvalDate: '2024-11-01',
    claimAmount: 5000,
    insurerContribution: 4500,
    patientResponsibility: 500,
    paymentStatus: 'Pending',
    auditTrail: [
      { action: 'Claim Approved', timestamp: '2024-11-01 10:30' },
      { action: 'Payment Initiated', timestamp: '2024-11-02 14:00' },
    ],
  },
  {
    id: 2,
    title: 'Claim 002',
    approvalDate: '2024-11-03',
    claimAmount: 8000,
    insurerContribution: 7000,
    patientResponsibility: 1000,
    paymentStatus: 'Processed',
    auditTrail: [
      { action: 'Claim Approved', timestamp: '2024-11-03 09:00' },
      { action: 'Payment Processed', timestamp: '2024-11-04 16:00' },
    ],
  },
];

const ApprovedClaims = () => {
  const [approvedClaims, setApprovedClaims] = useState(initialApprovedClaims);
  const [blockchainInfo, setBlockchainInfo] = useState({});

  // Simulate fetching blockchain info when a claim's payment is processed
  const handlePaymentAction = (claimId, action) => {
    setApprovedClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === claimId ? { ...claim, paymentStatus: action } : claim
      )
    );

    // Simulate blockchain update for the payment transaction
    const transaction = getBlockchainTransaction(claimId);
    setBlockchainInfo((prev) => ({ ...prev, [claimId]: transaction }));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600">Approved Claims</h2>
      <div className="mt-4 space-y-4">
        {approvedClaims.map((claim) => (
          <div key={claim.id} className="border p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold">{claim.title}</h3>
            <p>Approval Date: <span className="text-gray-700">{claim.approvalDate}</span></p>
            <p>Claim Amount: <span className="text-gray-700">${claim.claimAmount}</span></p>
            <p>Insurer Contribution: <span className="text-gray-700">${claim.insurerContribution}</span></p>
            <p>Patient Responsibility: <span className="text-gray-700">${claim.patientResponsibility}</span></p>
            <p>Payment Status: <span className="text-gray-700">{claim.paymentStatus}</span></p>

            {/* Action to Process Payment */}
            {claim.paymentStatus === 'Pending' && (
              <div className="mt-4 space-x-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handlePaymentAction(claim.id, 'Processed')}
                >
                  Mark as Processed
                </button>
              </div>
            )}

            {/* Settlement Tracking (Blockchain Info) */}
            {blockchainInfo[claim.id] && (
              <div className="mt-4 p-2 border bg-gray-100 rounded">
                <p><strong>Blockchain Status:</strong> {blockchainInfo[claim.id].status}</p>
                <p><strong>Transaction Hash:</strong> {blockchainInfo[claim.id].transactionHash}</p>
                <p><strong>Timestamp:</strong> {blockchainInfo[claim.id].timestamp}</p>
              </div>
            )}

            {/* Audit Trail */}
            <div className="mt-4">
              <h4 className="font-semibold text-lg">Audit Trail</h4>
              <ul className="list-disc pl-5">
                {claim.auditTrail.map((log, index) => (
                  <li key={index}>
                    {log.action} - <span className="text-gray-500">{log.timestamp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedClaims;
