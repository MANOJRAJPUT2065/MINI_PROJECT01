// components/DoctorPages/ManagePolicies.js
import React, { useState, useEffect } from 'react';

function ManagePolicies() {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        // Fetch the policies (dummy data or API call)
        setPolicies([
            { id: 1, name: 'Policy A', details: 'Details about Policy A' },
            { id: 2, name: 'Policy B', details: 'Details about Policy B' }
        ]);
    }, []);

    return (
        <div>
            <h2>Manage Policies</h2>
            <ul>
                {policies.map(policy => (
                    <li key={policy.id}>
                        <h3>{policy.name}</h3>
                        <p>{policy.details}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManagePolicies;
