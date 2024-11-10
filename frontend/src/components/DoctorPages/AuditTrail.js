// src/components/DoctorDashboard/AuditTrail.js
import React from 'react';

const AuditTrail = () => {
    const auditLog = [
        { action: 'Claim submitted', timestamp: '2024-11-10 12:00 PM' },
        { action: 'Claim approved', timestamp: '2024-11-10 2:30 PM' },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Audit Trail</h2>
            <ul>
                {auditLog.map((log, index) => (
                    <li key={index} className="mb-2">
                        <strong>{log.action}</strong> at {log.timestamp}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuditTrail;
