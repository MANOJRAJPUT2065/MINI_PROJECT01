import React, { useState } from 'react';

function ViewCompliance() {
    const [complianceData] = useState([
        {
            id: '1',
            name: 'Data Access Audit',
            description: 'Details of data accessed by authorized personnel.',
            date: '2024-11-01',
            status: 'Compliant',
        },
        {
            id: '2',
            name: 'Security Assessment',
            description: 'Evaluation of security controls in place.',
            date: '2024-11-05',
            status: 'Non-Compliant',
        },
        {
            id: '3',
            name: 'System Integrity Check',
            description: 'Verification of system integrity and updates.',
            date: '2024-11-10',
            status: 'Compliant',
        },
    ]);

    return (
        <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl shadow-lg">
            <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center animate-fade-in">
                Compliance Reports
            </h2>
            <p className="text-center text-lg text-blue-600 mb-4">
                View compliance reports and audit trails for system monitoring.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complianceData.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out"
                    >
                        <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                            {item.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <p className="text-gray-500 text-sm">
                            <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p className={`mt-2 font-semibold text-sm ${
                            item.status === 'Compliant' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            <strong>Status:</strong> {item.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewCompliance;
