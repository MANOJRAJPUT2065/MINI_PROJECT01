import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BLOCKCHAIN_EXPLORER = 'https://blockchainexplorer.com/tx/';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchParams, setSearchParams] = useState({
    patientName: '',
    provider: '',
    status: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Error state
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Fetch all claims from the backend
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/claim-history/history', {
          params: searchParams, // Passing search params to the backend for filtering
        });
        setClaims(response.data);
        setFilteredClaims(response.data); // Initially, show all claims
      } catch (error) {
        setError('Error fetching claims. Please try again later.');
        console.error('Error fetching claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [searchParams]);

  // Filter claims based on search parameters
  useEffect(() => {
    setFilteredClaims(claims.filter((claim) => {
      const { patientName, provider, status, fromDate, toDate, minAmount, maxAmount } = searchParams;

      const matchesPatientName = patientName ? claim.patientName.toLowerCase().includes(patientName.toLowerCase()) : true;
      const matchesProvider = provider ? claim.provider.toLowerCase().includes(provider.toLowerCase()) : true;
      const matchesStatus = status ? claim.status.toLowerCase() === status.toLowerCase() : true;
      const matchesDateRange = (fromDate && new Date(claim.treatmentDate) < new Date(fromDate)) || (toDate && new Date(claim.treatmentDate) > new Date(toDate)) ? false : true;
      const matchesAmount = claim.claimAmount >= (minAmount || 0) && claim.claimAmount <= (maxAmount || Infinity);

      return matchesPatientName && matchesProvider && matchesStatus && matchesDateRange && matchesAmount;
    }));
  }, [claims, searchParams]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // Show detailed view of a selected claim
  const showClaimDetails = (claim) => {
    setSelectedClaim(claim);
  };

  const closeClaimDetails = () => {
    setSelectedClaim(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-teal-600 mb-6">Claim History</h2>

      {/* Error Message */}
      {error && <div className="bg-red-500 text-white p-4 rounded-md mb-6">{error}</div>}

      {/* Search Filters */}
      <div className="my-4 bg-gray-100 p-4 rounded-md shadow-md">
        <h3 className="text-xl font-semibold mb-4">Search & Filter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.patientName}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="provider"
            placeholder="Provider"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.provider}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status (approved/rejected)"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.status}
            onChange={handleSearchChange}
          />
          <input
            type="date"
            name="fromDate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.fromDate}
            onChange={handleSearchChange}
          />
          <input
            type="date"
            name="toDate"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.toDate}
            onChange={handleSearchChange}
          />
          <input
            type="number"
            name="minAmount"
            placeholder="Min Amount"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.minAmount}
            onChange={handleSearchChange}
          />
          <input
            type="number"
            name="maxAmount"
            placeholder="Max Amount"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchParams.maxAmount}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <p>No claims found matching the search criteria.</p>
      ) : (
        <div className="space-y-4 mt-6">
          {filteredClaims.map((claim) => (
            <div key={claim.id} className="border border-gray-300 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg">{claim.patientName}</h3>
              <p><strong>Claim ID:</strong> {claim.id}</p>
              <p><strong>Provider:</strong> {claim.provider}</p>
              <p><strong>Claim Status:</strong> {claim.status}</p>
              <p><strong>Claim Amount:</strong> ${claim.claimAmount}</p>
              <button
                className="bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600"
                onClick={() => showClaimDetails(claim)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Claim Details</h3>
            <p><strong>Claim ID:</strong> {selectedClaim.id}</p>
            <p><strong>Diagnosis:</strong> {selectedClaim.diagnosis}</p>
            <p><strong>Procedure Codes:</strong> {selectedClaim.procedureCodes.join(', ')}</p>
            <p><strong>Treatment Date:</strong> {selectedClaim.treatmentDate}</p>
            <p><strong>Payment Status:</strong> {selectedClaim.paymentStatus}</p>
            <p><strong>Rejection Reason:</strong> {selectedClaim.rejectionReason || 'N/A'}</p>
            <p><strong>Transaction Hash:</strong> <a href={`${BLOCKCHAIN_EXPLORER}${selectedClaim.transactionHash}`} target="_blank" className="text-blue-500">View on Blockchain</a></p>
            <p><strong>Claim Document:</strong> <a href={selectedClaim.documentLink} target="_blank" className="text-blue-500">Download</a></p>
            <button
              className="bg-red-500 text-white p-2 rounded-md mt-4 hover:bg-red-600"
              onClick={closeClaimDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimHistory;
