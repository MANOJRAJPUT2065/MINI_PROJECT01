import React, { useState } from 'react';
import axios from 'axios';

const pinataApiKey = '2f9c5cedeeccfb53bd92';
const pinataSecretApiKey = '71e3baf407f519f8f430c72a0851ab3aabdebec2118c11ad08855c5244f2d510';
const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

const ClaimSubmission = () => {
    const [formData, setFormData] = useState({
        doctorId: '',
        patientId: '',
        diagnosis: '',
        treatment: '',
        claimAmount: '',
        report: null,
        ipfsLink: '', // To store the IPFS link
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];  // Assuming single file upload
        setFormData({ ...formData, report: file });
    };

    const uploadToIPFS = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(pinataUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey,
                },
            });
            return response.data.IpfsHash;  // Return the IPFS hash
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw new Error('Failed to upload to IPFS');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Upload the report to IPFS and get the IPFS hash
        let reportHash = '';
        if (formData.report) {
            try {
                reportHash = await uploadToIPFS(formData.report);
                // Store the IPFS link in the state
                const ipfsLink = `https://ipfs.io/ipfs/${reportHash}`;
                setFormData({ ...formData, ipfsLink });

                // Automatically copy the IPFS link to the clipboard
                await navigator.clipboard.writeText(ipfsLink);
                alert('IPFS link copied to clipboard!');

                // Reset the IPFS link after 10 seconds (for demonstration purposes)
                setTimeout(() => {
                    setFormData((prevState) => ({ ...prevState, ipfsLink: '' }));
                }, 10000); // Link will disappear after 10 seconds
            } catch (error) {
                alert('Failed to upload report to IPFS.');
                return;
            }
        }

        // Send the form data to the backend, including the IPFS hash of the report
        const data = {
            doctorId: formData.doctorId,
            patientId: formData.patientId,
            diagnosis: formData.diagnosis,
            treatment: formData.treatment,
            claimAmount: formData.claimAmount,
            reportHash, // Include the IPFS hash of the report
        };

        try {
            const response = await fetch('http://localhost:5000/api/claims/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Claim submitted successfully!');
                setFormData({
                    doctorId: '',
                    patientId: '',
                    diagnosis: '',
                    treatment: '',
                    claimAmount: '',
                    report: null,
                    ipfsLink: '', // Reset the IPFS link
                });
            } else {
                alert(result.error || 'Failed to submit claim.');
            }
        } catch (error) {
            console.error('Error submitting claim:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-teal-600 mb-6">Submit a Claim</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="doctorId" className="block text-gray-700 font-medium mb-2">
                        Doctor ID
                    </label>
                    <input
                        type="text"
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="patientId" className="block text-gray-700 font-medium mb-2">
                        Patient ID
                    </label>
                    <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="diagnosis" className="block text-gray-700 font-medium mb-2">
                        Diagnosis
                    </label>
                    <input
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="treatment" className="block text-gray-700 font-medium mb-2">
                        Treatment
                    </label>
                    <input
                        type="text"
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="claimAmount" className="block text-gray-700 font-medium mb-2">
                        Claim Amount
                    </label>
                    <input
                        type="number"
                        name="claimAmount"
                        value={formData.claimAmount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="report" className="block text-gray-700 font-medium mb-2">
                        Upload Report (PDF)
                    </label>
                    <input
                        type="file"
                        name="report"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
                >
                    Submit Claim
                </button>
            </form>

            {formData.ipfsLink && (
                <div className="mt-6 text-center">
                    <p>IPFS link (will disappear after 10 seconds):</p>
                    <a
                        href={formData.ipfsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 font-semibold"
                    >
                        {formData.ipfsLink}
                    </a>
                </div>
            )}
        </div>
    );
};

export default ClaimSubmission;
