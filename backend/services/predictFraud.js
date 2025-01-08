const axios = require('axios');

/**
 * Predict fraud status for a given claim.
 * @param {Object} claimData - The data for the claim.
 * @returns {Promise<boolean>} - Returns true if fraudulent, otherwise false.
 */
const predictFraud = async (claimData) => {
  try {
    const response = await axios.post('http://localhost:5000/predict', claimData); // Python API endpoint
    return response.data.isFraudulent; // Adjust based on your Python API response structure
  } catch (error) {
    console.error('Error in fraud detection API call:', error.message);
    throw new Error('Failed to predict fraud status');
  }
};

module.exports = { predictFraud };
