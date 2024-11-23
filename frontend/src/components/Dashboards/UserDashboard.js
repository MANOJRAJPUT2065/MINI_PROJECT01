import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Sidebar Component
const Sidebar = () => (
    <motion.div
        className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between transform transition-all duration-300"
        initial={{ opacity: 0, x: -250 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center space-x-4 mb-6">
            <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="rounded-full w-10 h-10"
            />
            <span className="text-lg font-semibold text-teal-600">Welcome 💞</span>
        </div>

        <ul className="space-y-4">
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/patient/dashboard-overview" className="text-teal-600">Dashboard Overview</Link>
            </li>

            
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/patient/claim-submission" className="text-teal-600">Claim Submission</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/patient/track-claims" className="text-teal-600">Track Claim Status</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/patient/view-reports" className="text-teal-600">View Reports</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/patient/settings" className="text-teal-600">Settings</Link>
            </li>
        </ul>
    </motion.div>
);

const UserDashboard = () => {
    const navigate = useNavigate();

    const LogoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login'); // Redirect to login
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mb-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="Profile"
                            className="rounded-full w-10 h-10"
                        />
                        <span className="text-lg font-semibold text-teal-600">Welcome, User</span>
                    </div>
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                        onClick={LogoutHandler}
                    >
                        Logout
                    </button>
                </div>
                <motion.div
                    className="bg-white rounded-xl shadow-lg p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
};

export default UserDashboard;
