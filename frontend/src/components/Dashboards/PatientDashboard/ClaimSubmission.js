// import React, { useState } from 'react';
// import axios from 'axios';

// const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

// const ClaimSubmission = () => {
//     const [formData, setFormData] = useState({
//         doctorName: '',
//         patientName: '',
//         doctorId: '',
//         patientId: '',
//         diagnosis: '',
//         treatment: '',
//         claimAmount: '',
//         report: null,
//         ipfsLink: '', // To store the IPFS link
//     });
//     const [isUploading, setIsUploading] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const allowedTypes = ['application/pdf'];
//             if (!allowedTypes.includes(file.type)) {
//                 alert('Only PDF files are allowed.');
//                 return;
//             }
//             if (file.size > 5 * 1024 * 1024) {
//                 alert('File size should not exceed 5MB.');
//                 return;
//             }
//             setFormData({ ...formData, report: file });
//         }
//     };

//     const uploadToIPFS = async (file) => {
//         const ipfsFormData = new FormData();
//         ipfsFormData.append('file', file);

//         try {
//             const response = await axios.post(pinataUrl, ipfsFormData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
//                     pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
//                 },
//             });
//             return response.data.IpfsHash; // Return the IPFS hash
//         } catch (error) {
//             console.error('Error uploading to IPFS:', error);
//             throw new Error('Failed to upload to IPFS. Please try again.');
//         }
//     };

//     const validateForm = () => {
//         const { doctorName, patientName, doctorId, patientId, diagnosis, treatment, claimAmount, report } = formData;
//         if (!doctorName || !patientName || !doctorId || !patientId || !diagnosis || !treatment || !claimAmount || !report) {
//             alert('All fields are required.');
//             return false;
//         }
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
    
//         setIsUploading(true); // Start loading
//         let reportHash = '';
    
//         try {
//             // Upload the report to IPFS
//             reportHash = await uploadToIPFS(formData.report);
    
//             // Store the IPFS link in the state
//             const ipfsLink = `https://ipfs.io/ipfs/${reportHash}`;
//             setFormData({ ...formData, ipfsLink });
    
//             // Automatically copy the IPFS link to the clipboard
//             await navigator.clipboard.writeText(ipfsLink);
//             alert('IPFS link copied to clipboard!');
    
//             // Prepare form data for backend submission
//             const data = {
//                 doctorName: formData.doctorName,
//                 patientName: formData.patientName,
//                 doctorId: formData.doctorId,
//                 patientId: formData.patientId,
//                 diagnosis: formData.diagnosis,
//                 treatment: formData.treatment,
//                 claimAmount: formData.claimAmount,
//                 reportCID: reportHash, // Send the IPFS CID
//             };
    
//             // Submit the form data to the backend
//             const response = await fetch('http://localhost:5000/api/_claims/submit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });
    
//             const result = await response.json();
    
//             if (response.ok) {
//                 alert('Claim submitted successfully!');
//                 setFormData({
//                     doctorName: '',
//                     patientName: '',
//                     doctorId: '',
//                     patientId: '',
//                     diagnosis: '',
//                     treatment: '',
//                     claimAmount: '',
//                     report: null,
//                     ipfsLink: '',
//                 });
//             } else {
//                 alert(result.error || 'Failed to submit claim.');
//             }
//         } catch (error) {
//             console.error('Error submitting claim:', error);
//             alert(error.message || 'An error occurred. Please try again.');
//         } finally {
//             setIsUploading(false); // Stop loading
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
//             <h1 className="text-2xl font-bold text-teal-600 mb-6">Submit a Claim</h1>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label htmlFor="doctorName" className="block text-gray-700 font-medium mb-2">
//                         Doctor Name
//                     </label>
//                     <input
//                         type="text"
//                         name="doctorName"
//                         value={formData.doctorName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="patientName" className="block text-gray-700 font-medium mb-2">
//                         Patient Name
//                     </label>
//                     <input
//                         type="text"
//                         name="patientName"
//                         value={formData.patientName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="doctorId" className="block text-gray-700 font-medium mb-2">
//                         Doctor ID
//                     </label>
//                     <input
//                         type="text"
//                         name="doctorId"
//                         value={formData.doctorId}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="patientId" className="block text-gray-700 font-medium mb-2">
//                         Patient ID
//                     </label>
//                     <input
//                         type="text"
//                         name="patientId"
//                         value={formData.patientId}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="diagnosis" className="block text-gray-700 font-medium mb-2">
//                         Diagnosis
//                     </label>
//                     <input
//                         type="text"
//                         name="diagnosis"
//                         value={formData.diagnosis}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="treatment" className="block text-gray-700 font-medium mb-2">
//                         Treatment
//                     </label>
//                     <input
//                         type="text"
//                         name="treatment"
//                         value={formData.treatment}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="claimAmount" className="block text-gray-700 font-medium mb-2">
//                         Claim Amount
//                     </label>
//                     <input
//                         type="number"
//                         name="claimAmount"
//                         value={formData.claimAmount}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="report" className="block text-gray-700 font-medium mb-2">
//                         Upload Report (PDF)
//                     </label>
//                     <input
//                         type="file"
//                         name="report"
//                         accept="application/pdf"
//                         onChange={handleFileChange}
//                         className="w-full px-4 py-2 border rounded-md"
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isUploading}
//                     className={`w-full py-2 rounded-md ${
//                         isUploading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
//                     } text-white transition`}
//                 >
//                     {isUploading ? 'Submitting...' : 'Submit Claim'}
//                 </button>
//             </form>

//             {formData.ipfsLink && (
//                 <div className="mt-6 text-center">
//                     <p>IPFS link:</p>
//                     <a
//                         href={formData.ipfsLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-teal-600 font-semibold"
//                     >
//                         {formData.ipfsLink}
//                     </a>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ClaimSubmission;


import React, { useState } from "react";
import axios from "axios";

const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const ClaimSubmission = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    patientName: "",
    doctorId: "",
    patientId: "",
    diagnosis: "",
    treatment: "",
    claimAmount: "",
    report: null,
    ipfsLink: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB.");
        return;
      }
      setFormData({ ...formData, report: file });
    }
  };

  const uploadToIPFS = async (file) => {
    const ipfsFormData = new FormData();
    ipfsFormData.append("file", file);

    try {
      const response = await axios.post(pinataUrl, ipfsFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error("Failed to upload to IPFS. Please try again.");
    }
  };

  const validateForm = () => {
    const {
      doctorName,
      patientName,
      doctorId,
      patientId,
      diagnosis,
      treatment,
      claimAmount,
      report,
    } = formData;
    if (
      !doctorName ||
      !patientName ||
      !doctorId ||
      !patientId ||
      !diagnosis ||
      !treatment ||
      !claimAmount ||
      !report
    ) {
      alert("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    let reportHash = "";

    try {
      reportHash = await uploadToIPFS(formData.report);

      const ipfsLink = `https://ipfs.io/ipfs/${reportHash}`;
      setFormData({ ...formData, ipfsLink });

      await navigator.clipboard.writeText(ipfsLink);
      alert("IPFS link copied to clipboard!");

      const data = {
        doctorName: formData.doctorName,
        patientName: formData.patientName,
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        claimAmount: formData.claimAmount,
        reportCID: reportHash,
      };

      const response = await fetch("http://localhost:5000/api/_claims/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Claim submitted successfully!");
        setFormData({
          doctorName: "",
          patientName: "",
          doctorId: "",
          patientId: "",
          diagnosis: "",
          treatment: "",
          claimAmount: "",
          report: null,
          ipfsLink: "",
        });
      } else {
        alert(result.error || "Failed to submit claim.");
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckStatus = async () => {
    const claimId = prompt("Enter the Claim ID to check the status:");
    if (!claimId) {
      alert("Claim ID is required.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/_claims/status/${claimId}`
      );
      const result = await response.json();

      if (response.ok) {
        alert(`Claim Status: ${result.status}`);
      } else {
        alert(result.error || "Failed to fetch claim status.");
      }
    } catch (error) {
      console.error("Error checking claim status:", error);
      alert("An error occurred while checking the status. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-teal-600 mb-6">Submit a Claim</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Doctor Name
          </label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Patient Name
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Doctor ID</label>
          <input
            type="text"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
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
          <label className="block text-gray-700 font-medium mb-2">Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Treatment</label>
          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
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
          <label className="block text-gray-700 font-medium mb-2">
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
          disabled={isUploading}
          className={`w-full py-2 rounded-md ${
            isUploading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
          } text-white transition`}
        >
          {isUploading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
      {formData.ipfsLink && (
        <div className="mt-6 text-center">
          <p>IPFS link:</p>
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
      <button
        onClick={handleCheckStatus}
        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
      >
        Check Claim Status
      </button>
    </div>
  );
};

export default ClaimSubmission;
