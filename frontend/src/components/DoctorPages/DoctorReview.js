import React, { useState, useEffect } from 'react';
import { Button, Input, List, Typography, message } from 'antd';

const { Title, Text } = Typography;

const DoctorReview = () => {
  const [claims, setClaims] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState({});
  const [manualFileUrls, setManualFileUrls] = useState({}); // Store manual URLs
  const [reviewingClaimId, setReviewingClaimId] = useState(null);

  // Fetch claims from the backend
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/claims/pending/pending');
        const data = await response.json();

        if (data && Array.isArray(data.pendingClaims)) {
          setClaims(data.pendingClaims);
        } else {
          message.error('Unexpected data format');
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
        message.error('Error fetching claims');
      }
    };

    fetchClaims();
  }, []);

  const handleReviewInputChange = (claimId, value) => {
    setDoctorReviews((prev) => ({
      ...prev,
      [claimId]: value,
    }));
  };

  const handleManualFileUrlChange = (claimId, value) => {
    setManualFileUrls((prev) => ({
      ...prev,
      [claimId]: value,
    }));
  };

  const handleReview = async (claimId, status) => {
    const doctorReview = doctorReviews[claimId];

    // For rejection, ensure a reason is provided
    if (status === 'reject' && !doctorReview) {
      return message.error('Please enter a rejection reason');
    }

    try {
      const response = await fetch(`http://localhost:5000/api/claims/pending/review/${claimId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          doctorReview: status === 'reject' ? doctorReview : '',
        }),
      });

      const result = await response.json();

      if (result.message) {
        message.success(result.message);
        setClaims(claims.filter((claim) => claim.claimId !== claimId)); // Remove reviewed claim from the list
        setReviewingClaimId(null); // Reset reviewing state after submission
      } else {
        message.error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error reviewing claim:', error);
      message.error('Error occurred while reviewing the claim');
    }
  };

  return (
    <div>
      <Title level={2}>Doctor Review Claims</Title>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={claims}
        renderItem={(claim) => (
          <List.Item
            key={claim.claimId}
            actions={[
              <Button
                type="primary"
                onClick={() => handleReview(claim.claimId, 'approve')}
              >
                Approve Claim
              </Button>,
              <Button
                type="danger"
                style={{ backgroundColor: '#ff4d4f', color: '#ffffff' }} // Red background with white text
                onClick={() => setReviewingClaimId(claim.claimId)} // Set claimId to start reviewing
              >
                Reject Claim
              </Button>,
            ]}
          >
            <div>
              <Title level={4}>Claim ID: {claim.claimId}</Title>
              <Text>Patient Name: {claim.patientName}</Text>
              <br />
              <Text>Description: {claim.description}</Text>
              <br />
              <Text>Amount: {claim.amount} ETH</Text>
              <br />
              <Text>Doctor: {claim.doctorName}</Text>
              <br />
              <Text>Status: {claim.status}</Text>
              <br />
              <Text>Submission Date: {new Date(claim.submissionDate).toLocaleString()}</Text>
              <br />
              <Text>Transaction Hash: {claim.transactionHash}</Text>
              <br />
              <Title level={5}>Documents:</Title>
              {claim.documents && claim.documents.length > 0 ? (
                <List
                  size="small"
                  bordered
                  dataSource={claim.documents}
                  renderItem={(document) => (
                    <List.Item key={document._id}>
                      <a
                        href={document.fileUrl} // Use the IPFS URL
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {document.fileType} - {document.fileUrl}
                      </a>
                      <br />
                      {/* Display IPFS Hash */}
                      <Text>IPFS Hash: {document.ipfsHash}</Text>
                    </List.Item>
                  )}
                />
              ) : (
                <Text>No documents available</Text>
              )}

              {/* Manual URL input for the doctor to check file manually */}
              <div style={{ marginTop: '10px' }}>
                <Text>Manual File URL : </Text>
                <Input
                  placeholder="Enter file URL manually"
                  value={manualFileUrls[claim.claimId] || ''}
                  onChange={(e) => handleManualFileUrlChange(claim.claimId, e.target.value)}
                  style={{ width: '70%', marginTop: '5px' }}
                />
                <Button
                  type="primary"
                  style={{ marginLeft: '10px' }}
                  onClick={() =>
                    manualFileUrls[claim.claimId] &&
                    window.open(manualFileUrls[claim.claimId], '_blank')
                  }
                >
                  Check Manually
                </Button>
              </div>
            </div>

            {reviewingClaimId === claim.claimId && (
              <div>
                <Input.TextArea
                  placeholder="Enter rejection reason"
                  value={doctorReviews[claim.claimId] || ''}
                  onChange={(e) => handleReviewInputChange(claim.claimId, e.target.value)}
                  rows={4}
                />
                <Button
                  type="primary"
                  onClick={() => handleReview(claim.claimId, 'reject')}
                  style={{ marginTop: 10 }}
                >
                  Submit Rejection
                </Button>
              </div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default DoctorReview;
