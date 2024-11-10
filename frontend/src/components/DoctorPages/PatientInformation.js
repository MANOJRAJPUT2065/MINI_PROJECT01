// src/components/DoctorDashboard/PatientInformation.js
import React, { useState } from 'react';

const PatientInformation = () => {
    const [patientData, setPatientData] = useState(null); // State for storing patient data

    const fetchPatientData = () => {
        // Simulating an API call or blockchain fetch
        setPatientData({
            name: "John Doe",
            age: 45,
            medicalHistory: "Hypertension, Asthma",
            currentTreatment: "Blood pressure medication",
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
            <button onClick={fetchPatientData} className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4">
                Load Patient Data
            </button>

            {patientData ? (
                <div>
                    <p><strong>Name:</strong> {patientData.name}</p>
                    <p><strong>Age:</strong> {patientData.age}</p>
                    <p><strong>Medical History:</strong> {patientData.medicalHistory}</p>
                    <p><strong>Current Treatment:</strong> {patientData.currentTreatment}</p>
                </div>
            ) : (
                <p>No data available. Click to load.</p>
            )}
        </div>
    );
};

export default PatientInformation;
