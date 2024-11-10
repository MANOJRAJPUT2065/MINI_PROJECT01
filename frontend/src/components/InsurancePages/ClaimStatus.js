// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ClaimStatus = () => {
//     const [claimId, setClaimId] = useState('');
//     const [status, setStatus] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         // Optional: You could fetch the claim status on component mount
//         // if a claimId is passed as a prop or from localStorage.
//     }, []);

//     const handleCheckStatus = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         setStatus('');

//         try {
//             // Updated API call with the correct route
//             const response = await axios.get(`http://localhost:5000/api/insurance/${claimId}`); // Change to /api/insurance
//             setStatus(response.data.status);  // Set the returned status
//         } catch (error) {
//             setError(error.response?.data?.message || 'Error checking claim status');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-4">
//             <form onSubmit={handleCheckStatus}>
//                 <div className="mb-4">
//                     <label htmlFor="claimId" className="block text-gray-700 font-bold mb-2">
//                         Claim ID:
//                     </label>
//                     <input
//                         type="text"
//                         id="claimId"
//                         value={claimId}
//                         onChange={(e) => setClaimId(e.target.value)}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     disabled={loading}
//                 >
//                     {loading ? 'Checking...' : 'Check Status'}
//                 </button>
//             </form>
//             {error && <p className="text-red-500 mt-2">{error}</p>}
//             {status && <p className="text-green-500 mt-2">Claim Status: {status}</p>}
//         </div>
//     );
// };

// export default ClaimStatus;


import React, { useState } from 'react';
import axios from 'axios';

const ClaimStatus = () => {
    const [claimId, setClaimId] = useState('');  // The raw claimId
    const [status, setStatus] = useState('');    // Stores the returned status
    const [error, setError] = useState('');      // Stores any errors
    const [loading, setLoading] = useState(false);

    // Function to handle the claim status check
    const handleCheckStatus = async (e) => {
        e.preventDefault();
        setLoading(true);   // Set loading state to true
        setError('');       // Reset previous errors
        setStatus('');      // Reset previous status

        try {
            // Make the GET request with the raw claimId to the backend API
            const response = await axios.get(`http://localhost:5000/api/insurance/${claimId}`);  // Ensure the backend is set up to handle this
            setStatus(response.data.status);  // Update the status
        } catch (error) {
            // Handle errors (e.g., invalid claimId, no internet connection)
            setError(error.response?.data?.message || 'Error checking claim status');
        } finally {
            setLoading(false);  // Set loading state to false once done
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleCheckStatus}>
                <div className="mb-4">
                    <label htmlFor="claimId" className="block text-gray-700 font-bold mb-2">
                        Claim ID:
                    </label>
                    <input
                        type="text"
                        id="claimId"
                        value={claimId}
                        onChange={(e) => setClaimId(e.target.value)}  // Handle input changes
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

            {/* Display error message */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            
            {/* Display the claim status */}
            {status && <p className="text-green-500 mt-2">Claim Status: {status}</p>}
        </div>
    );
};

export default ClaimStatus;
