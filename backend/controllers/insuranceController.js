// // Example mock data (to be replaced with DB logic if you are using a real database)
// const claims = {
//     '12345': { status: 'Processing' },
//     '67890': { status: 'Approved' },
//     '11223': { status: 'Denied' },
//     '44556': { status: 'Under Review' },
//   };
  
//   // Controller function to get claim status by claimId
//   const     getInsuranceClaimStatus = (req, res) => {
//     const { claimId } = req.params;
  
//     // Check if the claimId exists in the mock claims data
//     if (claims[claimId]) {
//       return res.json({ status: claims[claimId].status });
//     }
  
//     // If the claimId doesn't exist
//     return res.status(404).json({ message: 'Claim ID not found' });
//   };
  
//   export { getInsuranceClaimStatus };
  


const claims = {
    '12345': { status: 'Processing' },
    '67890': { status: 'Approved' },
    '11223': { status: 'Denied' },
    '44556': { status: 'Under Review' },
  };
  
  const getInsuranceClaimStatus = (req, res) => {
    const { claimId } = req.params;  // Get raw claimId from the route params
  
    // Check if the claimId exists in our mock data
    if (claims[claimId]) {
      return res.json({ status: claims[claimId].status });
    }
  
    // If the claimId is not found
    return res.status(404).json({ message: 'Claim ID not found' });
  };
  
  export { getInsuranceClaimStatus };
  
