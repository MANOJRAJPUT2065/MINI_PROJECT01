// src/components/AdminDashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const navigate = useNavigate(); // Get the navigate function

    const LogoutHandler = () => {
        // Remove token and role from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login'); 
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
                    <div className="flex items-center">
                        <img 
                            src="https://via.placeholder.com/40" // Replace with your image URL
                            alt="Profile"
                            className="w-10 h-10 rounded-full mr-4 border-2 border-blue-500"
                        />
                        <button 
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                            onClick={LogoutHandler}
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* Main content */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Manage Users */}
                    <motion.div 
                        className="bg-white shadow-md p-6 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="font-semibold text-lg mb-4">Manage Users</h2>
                        <p className="text-gray-600 mb-4">Control and edit user accounts.</p>
                        <Link to="/manage-users" className="text-blue-500 font-semibold">
                            Go to User Management
                        </Link>
                    </motion.div>

                    {/* View Reports */}
                    <motion.div 
                        className="bg-white shadow-md p-6 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="font-semibold text-lg mb-4">View Reports</h2>
                        <p className="text-gray-600 mb-4">Check system and user reports.</p>
                        <Link to="/view-reports" className="text-blue-500 font-semibold">
                            Go to Reports
                        </Link>
                    </motion.div>

                    {/* Settings */}
                    <motion.div 
                        className="bg-white shadow-md p-6 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="font-semibold text-lg mb-4">Settings</h2>
                        <p className="text-gray-600 mb-4">Adjust system preferences.</p>
                        <Link to="/settings" className="text-blue-500 font-semibold">
                            Go to Settings
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
