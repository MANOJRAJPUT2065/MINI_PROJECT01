// import React, { useState, useEffect } from 'react';

// const PendingClaims = () => {
//   const [claims, setClaims] = useState([]);
//   const [blockchainInfo, setBlockchainInfo] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Fetch the pending claims data from your backend
//     const fetchPendingClaims = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/claims/pending');
//         const data = await response.json();

//         if (data && data.pendingClaims) {
//           setClaims(data.pendingClaims);  // Set the claims array
//         } else {
//           console.error('Invalid data format');
//         }
//       } catch (error) {
//         console.error('Error fetching pending claims:', error);
//       }
//     };

//     fetchPendingClaims();
//   }, []);

//   // Simulate blockchain transaction
//   const getBlockchainTransaction = (claimId) => {
//     return {
//       status: 'Transaction Pending',
//       transactionHash: `0x${Math.random().toString(36).substr(2, 9)}`,
//       timestamp: new Date().toLocaleString(),
//     };
//   };

//   const handleClaimValidation = async (claimId) => {
//     setLoading(true);  // Set loading to true when the validation starts
//     try {
//       const response = await fetch(`http://localhost:5000/api/claims/validate/${claimId}`, {
//         method: 'POST',
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const blockchainTransaction = getBlockchainTransaction(claimId);
//         setBlockchainInfo((prevInfo) => ({
//           ...prevInfo,
//           [claimId]: blockchainTransaction,
//         }));
  
//         setClaims((prevClaims) =>
//           prevClaims.map((claim) =>
//             claim.claimId === claimId ? { ...claim, isVerified: true } : claim
//           )
//         );
//         alert('Claim validated successfully!');
//       } else {
//         alert(data.message || 'Validation failed.');
//       }
//     } catch (error) {
//       console.error('Error validating claim:', error);
//       alert('An error occurred while validating the claim.');
//     } finally {
//       setLoading(false);  // Set loading to false when the validation is complete
//     }
//   };
  

//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-teal-600">Pending Claims</h2>
//       <div className="mt-4 space-y-4">
//         {claims.map((claim) => (
//           <div key={claim.claimId} className="border p-4 rounded shadow-sm">
//             <h3 className="text-xl font-semibold">{`Claim ID: ${claim.claimId}`}</h3>
//             <p>Status: <span className="text-gray-700">{claim.isVerified ? 'Verified' : 'Not Verified'}</span></p>
//             <p className="text-sm text-gray-500">Claimant: {claim.claimant}</p>
//             <p className="text-sm text-gray-500">Amount: {claim.amount}</p>
//             <p className="text-sm text-gray-500">Doctor: {claim.doctorName}</p>
//             <p className="text-sm text-gray-500">Patient: {claim.patientName}</p>
//             <p className="text-sm text-gray-500">Description: {claim.description}</p>

//             <div className="mt-4 space-x-4">
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//                 onClick={() => handleClaimValidation(claim.claimId)}
//                 disabled={claim.isVerified || loading}
//               >
//                 {loading ? 'Validating...' : 'Validate Claim'}
//               </button>
//             </div>

//             {/* Blockchain Transparency */}
//             {blockchainInfo[claim.claimId] && (
//               <div className="mt-4 p-2 border bg-gray-100 rounded">
//                 <p><strong>Blockchain Status:</strong> {blockchainInfo[claim.claimId].status}</p>
//                 <p><strong>Transaction Hash:</strong> {blockchainInfo[claim.claimId].transactionHash}</p>
//                 <p><strong>Timestamp:</strong> {blockchainInfo[claim.claimId].timestamp}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PendingClaims;




import React, { useState, useEffect } from 'react';

const PendingClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState({});

  useEffect(() => {
    // Fetch the pending claims data from your backend
    const fetchPendingClaims = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/claims/pending');
        const data = await response.json();

        if (data && data.pendingClaims) {
          setClaims(data.pendingClaims);  // Set the claims array from backend
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching pending claims:', error);
      }
    };

    fetchPendingClaims();
  }, []);

  // Simulate blockchain transaction (for demo purposes)
  const getBlockchainTransaction = (claimId) => {
    return {
      status: 'Transaction Pending',
      transactionHash: `0x${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleString(),
    };
  };

  const handleClaimValidation = async (claimId) => {
    setLoading(true);  // Set loading to true when the validation starts
    try {
      // Make a POST request to the backend for claim validation
      const response = await fetch(`http://localhost:5000/api/claims/validate/${claimId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        // Get blockchain transaction details (for example, transaction hash)
        const blockchainTransaction = getBlockchainTransaction(claimId);

        // Update blockchain info and the status of the claim
        setBlockchainInfo((prevInfo) => ({
          ...prevInfo,
          [claimId]: blockchainTransaction,
        }));

        // Update claim status to 'verified'
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim.claimId === claimId ? { ...claim, status: 'verified' } : claim
          )
        );
        alert('Claim validated successfully!');
      } else {
        alert(data.message || 'Validation failed.');
      }
    } catch (error) {
      console.error('Error validating claim:', error);
      alert('An error occurred while validating the claim.');
    } finally {
      setLoading(false);  // Set loading to false when the validation is complete
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600">Pending Claims</h2>
      <div className="mt-4 space-y-4">
        {claims.map((claim) => (
          <div key={claim.claimId} className="border p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold">{`Claim ID: ${claim.claimId}`}</h3>
            <p>Status: <span className="text-gray-700">{claim.status === 'verified' ? 'Verified' : 'Pending'}</span></p>
            <p className="text-sm text-gray-500">Patient: {claim.patientName}</p>
            <p className="text-sm text-gray-500">Doctor: {claim.doctorName}</p>
            <p className="text-sm text-gray-500">Amount: {claim.amount}</p>
            <p className="text-sm text-gray-500">Rejection Reason: {claim.rejectionReason || 'N/A'}</p>
            <p className="text-sm text-gray-500">Dispute Message: {claim.disputeMessage || 'N/A'}</p>
            <p className="text-sm text-gray-500">Notes: {claim.notes || 'N/A'}</p>

            {/* Documents */}
            {claim.documents && claim.documents.length > 0 && (
              <div>
                <h4 className="mt-2 text-lg font-semibold">Documents:</h4>
                <ul>
                  {claim.documents.map((doc, index) => (
                    <li key={index} className="text-blue-600">{doc}</li> // Assuming documents are URLs or file names
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleClaimValidation(claim.claimId)}
                disabled={claim.status === 'verified' || loading}
              >
                {loading ? 'Validating...' : 'Validate Claim'}
              </button>
            </div>

            {/* Blockchain Transparency */}
            {blockchainInfo[claim.claimId] && (
              <div className="mt-4 p-2 border bg-gray-100 rounded">
                <p><strong>Blockchain Status:</strong> {blockchainInfo[claim.claimId].status}</p>
                <p><strong>Transaction Hash:</strong> {blockchainInfo[claim.claimId].transactionHash}</p>
                <p><strong>Timestamp:</strong> {blockchainInfo[claim.claimId].timestamp}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingClaims;
