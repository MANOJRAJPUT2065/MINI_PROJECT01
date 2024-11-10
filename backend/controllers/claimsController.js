// controllers/claimsController.js
import Claim from '../models/Claim.js';  // Assuming you have a Claim model
import Analytics from '../models/Analytics.js';  // Assuming you have an Analytics model

// Get all rejected claims
export const getRejectedClaims = async (req, res) => {
  try {
    const rejectedClaims = await Claim.find({ status: 'rejected' });
    res.json(rejectedClaims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rejected claims', error });
  }
};

// Dispute a claim
export const disputeClaim = async (req, res) => {
  const { claimId } = req.params;
  const { message } = req.body;

  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Update claim with dispute message
    claim.disputeMessage = message;
    claim.status = 'under review'; // Change status to "under review"
    await claim.save();

    res.json({ status: 'Dispute submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting dispute', error });
  }
};

// Get rejection analytics
export const getAnalytics = async (req, res) => {
  try {
    // Fetch rejection analytics from your model or logic
    const analytics = await Analytics.findOne();  // Assuming analytics are stored in a document
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rejection analytics', error });
  }
};
