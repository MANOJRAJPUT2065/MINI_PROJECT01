import React from 'react';

const ClaimItem = ({ claim, onApprove, onReject, onViewDetails }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-semibold text-xl">{claim.patientName}</h3>
      <p>Status: <span className={`font-semibold ${claim.status === 'pending' ? 'text-yellow-500' : claim.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{claim.status}</span></p>
      <p>Claim Amount: ${claim.claimAmount}</p>
      <p>Diagnosis: {claim.diagnosis}</p>
      <p>Provider: {claim.providerName}</p>

      <div className="mt-4 space-x-2">
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded"
          onClick={() => onViewDetails(claim)}
        >
          View Details
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => onApprove(claim.id)}
          disabled={claim.status !== 'pending'}
        >
          Approve
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => onReject(claim.id)}
          disabled={claim.status !== 'pending'}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ClaimItem;
