import React from 'react';

const ClaimDetailsModal = ({ claim, onClose }) => {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h3 className="text-xl font-semibold">Claim Details</h3>
        <div className="mt-4">
          <p><strong>Patient:</strong> {claim.patientName}</p>
          <p><strong>Provider:</strong> {claim.providerName}</p>
          <p><strong>Claim Amount:</strong> ${claim.claimAmount}</p>
          <p><strong>Diagnosis:</strong> {claim.diagnosis}</p>
          <p><strong>Procedure Codes:</strong> {claim.procedureCodes.join(', ')}</p>
          <p><strong>Treatment Date:</strong> {claim.treatmentDate}</p>
          <p><strong>Blockchain Tx Hash:</strong> {claim.transactionHash}</p>
        </div>
        <div className="mt-6 text-right">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsModal;
