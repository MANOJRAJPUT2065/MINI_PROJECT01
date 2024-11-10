

import React, { useState, useEffect } from 'react';
import ClaimItem from './ClaimItem';
import ClaimDetailsModal from './ClaimDetailsModal';
import { fetchClaims, approveClaim, rejectClaim } from './api'; // API functions (mocked)

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);

  // Fetch pending claims
  useEffect(() => {
    async function getClaims() {
      const data = await fetchClaims(); // Assume this fetches pending claims
      setClaims(data);
    }
    getClaims();
  }, []);

  const handleApprove = (claimId) => {
    approveClaim(claimId).then(() => {
      setClaims(prevClaims => prevClaims.map(claim =>
        claim.id === claimId ? { ...claim, status: 'approved' } : claim
      ));
    });
  };

  const handleReject = (claimId) => {
    rejectClaim(claimId).then(() => {
      setClaims(prevClaims => prevClaims.map(claim =>
        claim.id === claimId ? { ...claim, status: 'rejected' } : claim
      ));
    });
  };

  const openClaimDetails = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetails(true);
  };

  const closeClaimDetails = () => {
    setShowClaimDetails(false);
    setSelectedClaim(null);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600">Claims Management</h2>

      <div className="my-4">
        <input type="text" placeholder="Search claims..." className="p-2 border rounded" />
        {/* Add other filter options as needed */}
      </div>

      <div className="space-y-4">
        {claims.map((claim) => (
          <ClaimItem
            key={claim.id}
            claim={claim}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={openClaimDetails}
          />
        ))}
      </div>

      {showClaimDetails && (
        <ClaimDetailsModal
          claim={selectedClaim}
          onClose={closeClaimDetails}
        />
      )}
    </div>
  );
};

export default ClaimsManagement;
