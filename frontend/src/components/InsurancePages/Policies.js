import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Example data for health insurance policies and claims
const Policies = () => {
    const [activeTab, setActiveTab] = useState('claims');
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    // Sample health insurance policies
    const policiesData = [
        {
            id: 1,
            policyName: 'Basic Health Plan',
            coverage: 'Essential coverage',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: 'Active',
            claims: [
                { id: 1, date: '2024-05-01', status: 'Approved', amount: '5000' },
                { id: 2, date: '2024-06-15', status: 'Pending', amount: '2000' },
            ]
        },
        {
            id: 2,
            policyName: 'Premium Health Plan',
            coverage: 'Comprehensive coverage',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'Active',
            claims: [
                { id: 3, date: '2024-07-10', status: 'Rejected', amount: '1500' },
            ]
        },
    ];

    // Handle Tab Navigation (Claims or Settings)
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Select policy to view claims
    const handlePolicyClick = (policy) => {
        setSelectedPolicy(policy);
        setActiveTab('claims');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Policies Navbar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Your Health Insurance Policies</h1>
            </div>

            {/* Tabs for Claims and Settings */}
            <div className="flex mb-8">
                <button
                    className={`w-1/2 py-3 text-lg font-medium text-center rounded-lg ${activeTab === 'claims' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => handleTabClick('claims')}
                >
                    Claims
                </button>
                <button
                    className={`w-1/2 py-3 text-lg font-medium text-center rounded-lg ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => handleTabClick('settings')}
                >
                    Settings
                </button>
            </div>

            {/* Display Claims or Settings */}
            {activeTab === 'claims' && selectedPolicy ? (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Claims Section for the selected policy */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Claims for {selectedPolicy.policyName}</h2>
                    <table className="min-w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-left">Claim ID</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPolicy.claims.map((claim) => (
                                <tr key={claim.id} className="border-b">
                                    <td className="py-2 px-4">{claim.id}</td>
                                    <td className="py-2 px-4">{claim.date}</td>
                                    <td className="py-2 px-4">{claim.status}</td>
                                    <td className="py-2 px-4">${claim.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            ) : activeTab === 'claims' && !selectedPolicy ? (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Policy Selection Section */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Policy to View Claims</h2>
                    <div className="space-y-4">
                        {policiesData.map((policy) => (
                            <div key={policy.id} className="bg-white p-6 shadow-lg rounded-lg cursor-pointer" onClick={() => handlePolicyClick(policy)}>
                                <h3 className="text-xl font-medium text-gray-800">{policy.policyName}</h3>
                                <p className="text-gray-600">Coverage: {policy.coverage}</p>
                                <p className="text-gray-600">Status: {policy.status}</p>
                                <p className="text-gray-600">Policy Period: {policy.startDate} to {policy.endDate}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Settings Section */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Personal Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    defaultValue="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    defaultValue="john.doe@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Password</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter your current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter a new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Confirm your new password"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => alert('Settings Updated!')}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Policies;
