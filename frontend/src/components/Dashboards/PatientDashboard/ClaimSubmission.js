import React, { useState } from 'react';

const ClaimSubmission = () => {
    const [formData, setFormData] = useState({
        claimTitle: '',
        description: '',
        file: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare form data
        const formDataToSend = new FormData();
        formDataToSend.append('claimTitle', formData.claimTitle);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('file', formData.file);

        // Make API request to submit claim
        fetch('/api/claims/submit', {
            method: 'POST',
            body: formDataToSend,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Claim submitted successfully:', data);
                alert('Claim submitted successfully!');
            })
            .catch((error) => {
                console.error('Error submitting claim:', error);
                alert('Failed to submit claim.');
            });
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-teal-600 mb-6">Submit a Claim</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Claim Title */}
                <div className="mb-4">
                    <label htmlFor="claimTitle" className="block text-gray-700 font-medium mb-2">
                        Claim Title
                    </label>
                    <input
                        type="text"
                        id="claimTitle"
                        name="claimTitle"
                        className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={formData.claimTitle}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
                        Upload Supporting Documents
                    </label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        className="w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
                >
                    Submit Claim
                </button>
            </form>
        </div>
    );
};

export default ClaimSubmission;
