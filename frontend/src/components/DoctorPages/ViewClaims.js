import React, { useState, useEffect } from 'react';

function ViewClaims() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For now, use static data or mock data
        setClaims([
            { claimId: 1, patientName: "John Doe", amount: "$500", status: "Pending" },
            { claimId: 2, patientName: "Jane Smith", amount: "$700", status: "Approved" },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">View Claims</h2>
            {loading ? (
                <p>Loading claims...</p>
            ) : (
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-teal-100">
                            <th className="p-2 border-b">Claim ID</th>
                            <th className="p-2 border-b">Patient Name</th>
                            <th className="p-2 border-b">Amount</th>
                            <th className="p-2 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim) => (
                            <tr key={claim.claimId} className="hover:bg-teal-50">
                                <td className="p-2 border-b">{claim.claimId}</td>
                                <td className="p-2 border-b">{claim.patientName}</td>
                                <td className="p-2 border-b">{claim.amount}</td>
                                <td className="p-2 border-b">{claim.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ViewClaims;
