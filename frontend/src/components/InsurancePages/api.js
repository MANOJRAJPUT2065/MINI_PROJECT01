export const fetchClaims = async () => {
    // This is a mock function, replace with actual API call
    return [
      {
        id: 1,
        patientName: 'Manoj singh Rajput',
        claimAmount: 1500,
        diagnosis: 'Flu',
        providerName: 'HealthCare Inc.',
        status: 'pending',
        procedureCodes: ['A01', 'B03'],
        treatmentDate: '2024-10-01',
        transactionHash: '0x123abc456def'
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        claimAmount: 2500,
        diagnosis: 'Knee Surgery',
        providerName: 'Orthopedic Health',
        status: 'pending',
        procedureCodes: ['C02', 'D04'],
        treatmentDate: '2024-09-15',
        transactionHash: '0x789xyz123ghi'
      },
    ];
  };
  

  export const approveClaim = async (claimId) => {
    // Simulate approval logic
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
  
  export const rejectClaim = async (claimId) => {
    // Simulate rejection logic
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
  