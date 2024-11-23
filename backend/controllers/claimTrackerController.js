// controllers/claimTrackerController.js

// Sample data (mocked data, replace with real database queries)
const claimData = {
    '12345': { status: 'Claim Submitted', timestamp: new Date() },
    '67890': { status: 'Claim Under Review', timestamp: new Date() },
};

// Controller to fetch claim status based on claim ID
export const getClaimStatus = (req, res) => {
    const { claimId } = req.params; // Get claimId from URL params

    if (claimData[claimId]) {
        // Return claim details
        res.json({
            claimId: claimId,
            status: claimData[claimId].status,
            timestamp: claimData[claimId].timestamp,
        });
    } else {
        // Return error if claim not found
        res.status(404).json({ message: 'Claim not found' });
    }
};
