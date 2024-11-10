// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const RejectedClaims = () => {
//   const [rejectedClaims, setRejectedClaims] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [disputeStatus, setDisputeStatus] = useState(null);
//   const [disputeMessage, setDisputeMessage] = useState("");
//   const [analytics, setAnalytics] = useState({ rejectionReasons: [], fraudRisk: '' });

//   // Fetch the rejected claims and analytics from the backend (API)
//   useEffect(() => {
//     const fetchRejectedClaims = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/claims/rejected'); // API endpoint to get rejected claims
//         setRejectedClaims(response.data);
//       } catch (error) {
//         console.error('Error fetching rejected claims:', error);
//       }
//     };

//     const fetchAnalytics = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/claims/analytics'); // API endpoint to get rejection analytics
//         setAnalytics(response.data);
//       } catch (error) {
//         console.error('Error fetching rejection analytics:', error);
//       }
//     };

//     fetchRejectedClaims();
//     fetchAnalytics();
//   }, []);

//   // Handle the dispute process
//   const handleDispute = async (claimId) => {
//     if (!disputeMessage) {
//       alert('Please provide a dispute message');
//       return;
//     }
//     try {
//       const response = await axios.post(`/api/claims/dispute/${claimId}`, {
//         message: disputeMessage,  // Dispute message entered by the user
//       });
//       setDisputeStatus(response.data.status);
//     } catch (error) {
//       console.error("Error submitting dispute:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-teal-600">Rejected Claims</h2>
      
//       {rejectedClaims.length === 0 ? (
//         <p>No rejected claims found.</p>
//       ) : (
//         <div>
//           <div className="space-y-4">
//             {rejectedClaims.map((claim) => (
//               <div key={claim.id} className="border border-gray-300 p-4 rounded-md">
//                 <h3 className="font-bold">{claim.patientName}</h3>
//                 <p><strong>Claim ID:</strong> {claim.id}</p>
//                 <p><strong>Rejection Reason:</strong> {claim.rejectionReason}</p>
//                 <p><strong>Amount Claimed:</strong> ${claim.amount}</p>
//                 <p><strong>Rejection Date:</strong> {new Date(claim.rejectionDate).toLocaleDateString()}</p>
//                 <p><strong>Notes:</strong> {claim.notes}</p>
//                 <div className="mt-2">
//                   <button
//                     className="bg-blue-500 text-white p-2 rounded-md"
//                     onClick={() => handleDispute(claim.id)}
//                   >
//                     Dispute Claim
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Dispute Status */}
//           {disputeStatus && (
//             <div className="mt-4 p-4 border border-green-300 rounded-md bg-green-50">
//               <strong>Dispute Status: </strong> {disputeStatus}
//             </div>
//           )}

//           {/* Dispute Message Section */}
//           <div className="mt-4">
//             <h3 className="text-xl font-semibold">Submit Dispute Message</h3>
//             <textarea
//               className="w-full border border-gray-300 p-2 mt-2"
//               rows="4"
//               placeholder="Provide additional details for the dispute..."
//               value={disputeMessage}
//               onChange={(e) => setDisputeMessage(e.target.value)}
//             ></textarea>
//             <button
//               className="mt-2 bg-blue-500 text-white p-2 rounded-md"
//               onClick={() => handleDispute(1)} // Pass dynamic claimId here (you'll need the selected claimId)
//             >
//               Submit Dispute
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Rejection Analytics */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold">Rejected Claims Analytics</h3>
//         <div className="space-y-2">
//           {/* Render rejection reason trends dynamically */}
//           <div className="border border-gray-300 p-4 rounded-md">
//             <strong>Common Rejection Reasons:</strong>
//             <ul>
//               {analytics.rejectionReasons.length > 0 ? (
//                 analytics.rejectionReasons.map((reason, index) => (
//                   <li key={index}>{reason.name}: {reason.count} claims</li>
//                 ))
//               ) : (
//                 <li>No data available</li>
//               )}
//             </ul>
//           </div>

//           {/* Display Fraud Risk Trend dynamically */}
//           <div className="border border-gray-300 p-4 rounded-md">
//             <strong>Fraud Risk Trend:</strong>
//             <p>{analytics.fraudRisk || 'No fraud risk data available'}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RejectedClaims;
  


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';

const RejectedClaims = () => {
  const [rejectedClaims, setRejectedClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disputeStatus, setDisputeStatus] = useState(null);
  const [disputeMessage, setDisputeMessage] = useState('');
  const [analytics, setAnalytics] = useState({ rejectionReasons: [], fraudRisk: '' });

  // Fetch the rejected claims and analytics from the backend (API)
  useEffect(() => {
    const fetchRejectedClaims = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/claims/rejected');
        setRejectedClaims(response.data);
      } catch (error) {
        console.error('Error fetching rejected claims:', error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/claims/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching rejection analytics:', error);
      }
    };

    fetchRejectedClaims();
    fetchAnalytics();
  }, []);

  // Handle the dispute process
  const handleDispute = async (claimId) => {
    if (!disputeMessage) {
      alert('Please provide a dispute message');
      return;
    }
    try {
      const response = await axios.post(`/api/claims/dispute/${claimId}`, {
        message: disputeMessage,  // Dispute message entered by the user
      });
      setDisputeStatus(response.data.status);
    } catch (error) {
      console.error('Error submitting dispute:', error);
    }
  };

  // Animation for claim container
  const claimContainerAnimation = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(50px)' : 'translateY(0px)',
    config: { tension: 170, friction: 26 }
  });

  // Animation for the dispute button
  const disputeButtonAnimation = useSpring({
    opacity: disputeStatus ? 0 : 1,
    transform: disputeStatus ? 'scale(0.8)' : 'scale(1)',
    config: { tension: 200, friction: 15 }
  });

  // Loading state with fun emoji
  if (loading) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-teal-600">Rejected Claims</h2>
        <p>🔒 We're currently working on integrating blockchain and Web3 features for complete transparency and security. Stay tuned!</p>
        <p>💡 <strong>Note:</strong> Once complete, you'll be able to track every stage of the claims process securely on the blockchain.</p>
        <p>💪 Health insurance is the safety net for life's uncertainties. Stay covered and stay healthy! 🏥</p>
        <p>"Insurance is the safety net for life's uncertainties. Stay covered, stay healthy!" 😊</p>
        <p>
  We are excited to inform you that as part of our ongoing development, the system is transitioning to leverage blockchain technology for enhanced transparency and security. 
  <br />
  Soon, claims will be processed dynamically, with every step securely recorded on the blockchain. This will not only streamline workflows but also provide real-time tracking and immutable records for all parties involved. 
  <br />
  Stay tuned for the upcoming updates as we continue to improve and innovate. The future of insurance claims processing is here! 🎉
</p>

<p>
  Regards from <strong>Manoj Singh and his team</strong>!
</p>

      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600">Rejected Claims</h2>
      {rejectedClaims.length === 0 ? (
        <p>No rejected claims found.</p>
      ) : (
        <animated.div style={claimContainerAnimation}>
          <div className="space-y-4">
            {rejectedClaims.map((claim) => (
              <div key={claim.id} className="border border-gray-300 p-4 rounded-md shadow-md">
                <h3 className="font-bold text-lg">{claim.patientName}</h3>
                <p><strong>Claim ID:</strong> {claim.id}</p>
                <p><strong>Rejection Reason:</strong> {claim.rejectionReason}</p>
                <p><strong>Amount Claimed:</strong> ${claim.amount}</p>
                <p><strong>Rejection Date:</strong> {new Date(claim.rejectionDate).toLocaleDateString()}</p>
                <p><strong>Notes:</strong> {claim.notes}</p>
                <animated.div style={disputeButtonAnimation}>
                  <button
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    onClick={() => handleDispute(claim.id)}
                  >
                    Dispute Claim 🧐
                  </button>
                </animated.div>
              </div>
            ))}
          </div>

          {/* Dispute Status */}
          {disputeStatus && (
            <div className="mt-4 p-4 border border-green-300 rounded-md bg-green-50">
              <strong>Dispute Status: </strong> {disputeStatus} 😊
            </div>
          )}

          {/* Dispute Message Section */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Submit Dispute Message</h3>
            <textarea
              className="w-full border border-gray-300 p-2 mt-2"
              rows="4"
              placeholder="Provide additional details for the dispute..."
              value={disputeMessage}
              onChange={(e) => setDisputeMessage(e.target.value)}
            ></textarea>
            <button
              className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              onClick={() => handleDispute(1)} // Pass dynamic claimId here (you'll need the selected claimId)
            >
              Submit Dispute 🚀
            </button>
          </div>
        </animated.div>
      )}

      {/* Rejection Analytics */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Rejected Claims Analytics</h3>
        <div className="space-y-2">
          {/* Render rejection reason trends dynamically */}
          <div className="border border-gray-300 p-4 rounded-md">
            <strong>Common Rejection Reasons:</strong>
            <ul>
              {analytics.rejectionReasons.length > 0 ? (
                analytics.rejectionReasons.map((reason, index) => (
                  <li key={index}>
                    {reason.name}: {reason.count} claims <span role="img" aria-label="warning">⚠️</span>
                  </li>
                ))
              ) : (
                <li>No data available</li>
              )}
            </ul>
          </div>

          {/* Display Fraud Risk Trend dynamically */}
          <div className="border border-gray-300 p-4 rounded-md">
            <strong>Fraud Risk Trend:</strong>
            <p>{analytics.fraudRisk || 'No fraud risk data available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedClaims;
