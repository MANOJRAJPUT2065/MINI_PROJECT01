// import React, { useState } from 'react';

// const ClaimSubmission = () => {
//     const [formData, setFormData] = useState({
//         doctorId: '',
//         patientId: '',
//         diagnosis: '',
//         treatment: '',
//         claimAmount: ''
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch('http://localhost:5000/api/claims/submit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert('Claim submitted successfully!');
//                 setFormData({
//                     doctorId: '',
//                     patientId: '',
//                     diagnosis: '',
//                     treatment: '',
//                     claimAmount: ''
//                 });
//             } else {
//                 alert(result.error || 'Failed to submit claim.');
//             }
//         } catch (error) {
//             console.error('Error submitting claim:', error);
//             alert('An error occurred. Please try again.');
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
//             <h1 className="text-2xl font-bold text-teal-600 mb-6">Submit a Claim</h1>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label htmlFor="doctorId" className="block text-gray-700 font-medium mb-2">
//                         Doctor ID
//                     </label>
//                     <input
//                         type="text"
//                         id="doctorId"
//                         name="doctorId"
//                         value={formData.doctorId}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border rounded-lg"
//                         required
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="patientId" className="block text-gray-700 font-medium mb-2">
//                         Patient ID
//                     </label>
//                     <input
//                         type="text"
//                         id="patientId"
//                         name="patientId"
//                         value={formData.patientId}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border rounded-lg"
//                         required
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="diagnosis" className="block text-gray-700 font-medium mb-2">
//                         Diagnosis
//                     </label>
//                     <input
//                         type="text"
//                         id="diagnosis"
//                         name="diagnosis"
//                         value={formData.diagnosis}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border rounded-lg"
//                         required
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="treatment" className="block text-gray-700 font-medium mb-2">
//                         Treatment
//                     </label>
//                     <input
//                         type="text"
//                         id="treatment"
//                         name="treatment"
//                         value={formData.treatment}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border rounded-lg"
//                         required
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="claimAmount" className="block text-gray-700 font-medium mb-2">
//                         Claim Amount
//                     </label>
//                     <input
//                         type="number"
//                         id="claimAmount"
//                         name="claimAmount"
//                         value={formData.claimAmount}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border rounded-lg"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
//                 >
//                     Submit Claim
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ClaimSubmission;



import React, { useState } from 'react';

const ClaimSubmission = () => {
    const [formData, setFormData] = useState({
        doctorId: '',
        patientId: '',
        diagnosis: '',
        treatment: '',
        claimAmount: '',
        report: null // To handle file uploads
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Assuming single file upload
        setFormData({ ...formData, report: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a new FormData object to send file and other form data
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('doctorId', formData.doctorId);
        formDataToSubmit.append('patientId', formData.patientId);
        formDataToSubmit.append('diagnosis', formData.diagnosis);
        formDataToSubmit.append('treatment', formData.treatment);
        formDataToSubmit.append('claimAmount', formData.claimAmount);
        formDataToSubmit.append('report', formData.report); // Add file to the FormData

        try {
            const response = await fetch('http://localhost:5000/api/claims/submit', {
                method: 'POST',
                body: formDataToSubmit
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
                    report: null // Reset file input
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
                        id="doctorId"
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="patientId" className="block text-gray-700 font-medium mb-2">
                        Patient ID
                    </label>
                    <input
                        type="text"
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="diagnosis" className="block text-gray-700 font-medium mb-2">
                        Diagnosis
                    </label>
                    <input
                        type="text"
                        id="diagnosis"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="treatment" className="block text-gray-700 font-medium mb-2">
                        Treatment
                    </label>
                    <input
                        type="text"
                        id="treatment"
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="claimAmount" className="block text-gray-700 font-medium mb-2">
                        Claim Amount
                    </label>
                    <input
                        type="number"
                        id="claimAmount"
                        name="claimAmount"
                        value={formData.claimAmount}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="report" className="block text-gray-700 font-medium mb-2">
                        Report (PDF/Image)
                    </label>
                    <input
                        type="file"
                        id="report"
                        name="report"
                        onChange={handleFileChange}
                        className="w-full p-3 border rounded-lg"
                        accept=".pdf,.png,.jpg,.jpeg"
                        required
                    />
                </div>

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
