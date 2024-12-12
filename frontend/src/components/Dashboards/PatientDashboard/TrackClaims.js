// import React from 'react';

// const TrackClaims = () => {
//     const claims = [
//         { id: 1, policyNumber: 'POL12345', status: 'Pending', date: '2024-11-10' },
//         { id: 2, policyNumber: 'POL54321', status: 'Approved', date: '2024-11-12' },
//         { id: 3, policyNumber: 'POL98765', status: 'Rejected', date: '2024-11-15' },
//     ];

//     return (
//         <div className="p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold text-teal-600">Track Claim Status</h1>
//             <p className="mt-4 text-gray-700">
//                 View and track the status of your insurance claims here.
//             </p>

//             <div className="mt-6 overflow-x-auto">
//                 <table className="w-full text-left border-collapse border border-gray-200">
//                     <thead>
//                         <tr className="bg-teal-500 text-white">
//                             <th className="p-4 border border-gray-300">Claim ID</th>
//                             <th className="p-4 border border-gray-300">Policy Number</th>
//                             <th className="p-4 border border-gray-300">Status</th>
//                             <th className="p-4 border border-gray-300">Submission Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {claims.map((claim) => (
//                             <tr
//                                 key={claim.id}
//                                 className="hover:bg-gray-100 transition duration-200"
//                             >
//                                 <td className="p-4 border border-gray-300">{claim.id}</td>
//                                 <td className="p-4 border border-gray-300">{claim.policyNumber}</td>
//                                 <td
//                                     className={`p-4 border border-gray-300 ${
//                                         claim.status === 'Approved'
//                                             ? 'text-green-600'
//                                             : claim.status === 'Rejected'
//                                             ? 'text-red-600'
//                                             : 'text-yellow-600'
//                                     }`}
//                                 >
//                                     {claim.status}
//                                 </td>
//                                 <td className="p-4 border border-gray-300">{claim.date}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default TrackClaims;





// import React, { useState, useEffect } from 'react';

// const TrackClaims = ({ patientId }) => {
//     const [claims, setClaims] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!patientId) {
//             setError("Patient ID is missing");
//             setLoading(false);
//             return;
//         }

//         // Fetch claims data for the patient from the backend API
//         const fetchClaims = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5000/api/_claims/claims/${patientId}`);
//                 if (!response.ok) {
//                     throw new Error("Error fetching claims data");
//                 }
//                 const data = await response.json();
//                 setClaims(data);
//                 setLoading(false);
//             } catch (err) {
//                 setError("Error fetching claims data");
//                 setLoading(false);
//             }
//         };

//         fetchClaims();
//     }, [patientId]);

//     // Handle loading and error states
//     if (loading) {
//         return <div className="p-6 bg-white rounded-lg shadow-md text-center">Loading claims...</div>;
//     }

//     if (error) {
//         return <div className="p-6 bg-white rounded-lg shadow-md text-center text-red-600">{error}</div>;
//     }

//     return (
//         <div className="p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold text-teal-600">Track Claim Status</h1>
//             <p className="mt-4 text-gray-700">View and track the status of your insurance claims here.</p>

//             <div className="mt-6 overflow-x-auto">
//                 <table className="w-full text-left border-collapse border border-gray-200">
//                     <thead>
//                         <tr className="bg-teal-500 text-white">
//                             <th className="p-4 border border-gray-300">Claim ID</th>
//                             <th className="p-4 border border-gray-300">Policy Number</th>
//                             <th className="p-4 border border-gray-300">Status</th>
//                             <th className="p-4 border border-gray-300">Submission Date</th>
//                             <th className="p-4 border border-gray-300">Transaction Hash (Chain ID)</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {claims.map((claim) => (
//                             <tr key={claim.claimId} className="hover:bg-gray-100 transition duration-200">
//                                 <td className="p-4 border border-gray-300">{claim.claimId}</td>
//                                 <td className="p-4 border border-gray-300">{claim.policyNumber}</td>
//                                 <td className={`p-4 border border-gray-300 ${claim.status === 'Approved' ? 'text-green-600' : claim.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
//                                     {claim.status}
//                                 </td>
//                                 <td className="p-4 border border-gray-300">{claim.date}</td>
//                                 <td className="p-4 border border-gray-300">{claim.transactionHash}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default TrackClaims;


import React, { useState, useEffect } from 'react';

const TrackClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all claims data from the backend API
        const fetchClaims = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/_claims/claims");
                if (!response.ok) {
                    throw new Error("Error fetching claims data");
                }
                const data = await response.json();

                // Ensure all claims are included
                const allClaims = data.map(claim => ({
                    claimId: claim.claimId || 'N/A',
                    policyNumber: claim.policyNumber || 'N/A',
                    status: claim.status || 'N/A',
                    submissionDate: claim.submissionDate || 'N/A',
                    transactionHash: claim.transactionHash || 'N/A',
                }));

                setClaims(allClaims);
                setLoading(false);
            } catch (err) {
                setError("Error fetching claims data");
                setLoading(false);
            }
        };

        fetchClaims();
    }, []);

    // Handle loading and error states
    if (loading) {
        return <div className="p-6 bg-white rounded-lg shadow-md text-center">Loading claims...</div>;
    }

    if (error) {
        return <div className="p-6 bg-white rounded-lg shadow-md text-center text-red-600">{error}</div>;
    }

    // TODO: DELETE CLAIM 
    const handleDeleteClaim = async (claimId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/claims/${claimId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Error deleting claim');
            }
    
            // Remove the claim from state/UI
            setClaims((prevClaims) => prevClaims.filter((claim) => claim.claimId !== claimId));
        } catch (error) {
            console.error('Error deleting claim:', error);
        }
    };
    
      

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-teal-600">Track Claim Status</h1>
            <p className="mt-4 text-gray-700">View and track the status of your insurance claims here.</p>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-teal-500 text-white">
                            <th className="p-4 border border-gray-300">Claim ID</th>
                            <th className="p-4 border border-gray-300">Policy Number</th>
                            <th className="p-4 border border-gray-300">Status</th>
                            <th className="p-4 border border-gray-300">Submission Date</th>
                            <th className="p-4 border border-gray-300">Transaction Hash (Chain ID)</th>
                            <th className="p-4 border border-gray-300">Actions</th> {/* New column for Delete button */}
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim, index) => (
                            <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                <td className="p-4 border border-gray-300">{claim.claimId}</td>
                                <td className="p-4 border border-gray-300">{claim.policyNumber}</td>
                                <td className={`p-4 border border-gray-300 ${
                                    claim.status === 'Approved' ? 'text-green-600' :
                                    claim.status === 'Rejected' ? 'text-red-600' :
                                    'text-yellow-600'
                                }`}>
                                    {claim.status}
                                </td>
                                <td className="p-4 border border-gray-300">{claim.submissionDate}</td>
                                <td className="p-4 border border-gray-300">{claim.transactionHash}</td>
                                <td className="p-4 border border-gray-300">
                                    <button 
                                        onClick={() => handleDeleteClaim(claim.claimId)} 
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackClaims;
