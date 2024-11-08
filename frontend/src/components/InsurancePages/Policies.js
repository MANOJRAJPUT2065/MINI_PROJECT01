import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// Example components for Claims and Settings
const Policies = () => {
    // const navigate = useNavigate();
    
    // States for Claims and Settings
    const [activeTab, setActiveTab] = useState('claims');
    
    // Handle Tab Navigation (Claims or Settings)
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Dummy Claims Data (you can replace it with actual data)
    const claimsData = [
        { id: 1, date: '2024-05-01', status: 'Approved', amount: '5000' },
        { id: 2, date: '2024-06-15', status: 'Pending', amount: '2000' },
        { id: 3, date: '2024-07-10', status: 'Rejected', amount: '1500' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Policies Navbar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Your Policies</h1>
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
            {activeTab === 'claims' ? (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Claims Section */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Claims</h2>
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
                            {claimsData.map((claim) => (
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
