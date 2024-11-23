import express from 'express';
const router = express.Router();

// Assuming the claims data is available as a mock object for simplicity
const claims = {
  '12345': { 
    status: 'Processing',
    patientName: 'Manoj Singh Rajput',
    provider: 'HealthCare Inc.',
    claimAmount: 1500,
    diagnosis: 'Flu',
    procedureCodes: ['A01', 'B03'],
    treatmentDate: '2024-10-01',
    transactionHash: '0x123abc456def',
    rejectionReason: '',
    paymentStatus: 'Pending',
    documentLink: 'https://example.com/document.pdf'
  },
  '67890': { 
    status: 'Approved',
    patientName: 'Jane Smith',
    provider: 'Orthopedic Health',
    claimAmount: 2500,
    diagnosis: 'Knee Surgery',
    procedureCodes: ['C02', 'D04'],
    treatmentDate: '2024-09-15',
    transactionHash: '0x789xyz123ghi',
    rejectionReason: '',
    paymentStatus: 'Paid',
    documentLink: 'https://example.com/document.pdf'
  },
};

// Route to get claim history with query parameters
router.get('/history', (req, res) => {
  const { patientName, provider, status, fromDate, toDate, minAmount, maxAmount } = req.query;

  let filteredClaims = Object.values(claims);

  // Filtering logic
  if (patientName) {
    filteredClaims = filteredClaims.filter(claim =>
      claim.patientName.toLowerCase().includes(patientName.toLowerCase())
    );
  }
  if (provider) {
    filteredClaims = filteredClaims.filter(claim =>
      claim.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }
  if (status) {
    filteredClaims = filteredClaims.filter(claim =>
      claim.status.toLowerCase() === status.toLowerCase()
    );
  }
  if (fromDate) {
    filteredClaims = filteredClaims.filter(claim => 
      new Date(claim.treatmentDate) >= new Date(fromDate)
    );
  }
  if (toDate) {
    filteredClaims = filteredClaims.filter(claim => 
      new Date(claim.treatmentDate) <= new Date(toDate)
    );
  }
  if (minAmount) {
    filteredClaims = filteredClaims.filter(claim => claim.claimAmount >= minAmount);
  }
  if (maxAmount) {
    filteredClaims = filteredClaims.filter(claim => claim.claimAmount <= maxAmount);
  }

  res.json(filteredClaims);
});

export default router;
