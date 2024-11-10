// components/DoctorPages/ManageClaims.js
import React, { useState, useEffect } from 'react';

function ManageClaims() {
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        // Fetch the claims (dummy data or API call)
        setClaims([
            { id: 1, claimStatus: 'Pending', patient: 'John Doe' },
            { id: 2, claimStatus: 'Approved', patient: 'Jane Smith' }
        ]);
    }, []);

    return (
        <div>
            <h2>Manage Claims</h2>
            <ul>
                {claims.map(claim => (
                    <li key={claim.id}>
                        <p>Patient: {claim.patient}</p>
                        <p>Status: {claim.claimStatus}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageClaims;
