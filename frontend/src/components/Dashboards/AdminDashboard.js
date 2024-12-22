import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
 
// Sidebar Component (for Doctor Dashboard)
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
            <span className="text-lg font-semibold text-teal-600">Doctor Name</span>
        </div>

        <ul className="space-y-4">
            {/* Doctor Dashboard Sidebar Links */}
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor" className="text-teal-600">Dashboard Overview</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/manage-policies" className="text-teal-600">Manage Policies</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/manage-users" className="text-teal-600">Manage Users</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/manage-claims" className="text-teal-600">Manage Claims</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/view-claims" className="text-teal-600">View Claims</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/view-reports" className="text-teal-600">View Reports</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/view-compliance" className="text-teal-600">Compliance</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/system-settings" className="text-teal-600">System Settings</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/claim-submission" className="text-teal-600">Review</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/track-claim-status" className="text-teal-600">Track Claim Status</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/smart-contract-interaction" className="text-teal-600">Smart Contract</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/activity-log" className="text-teal-600">Activity Logs</Link>
            </li>
            <li className="hover:shadow-lg hover:bg-teal-100 p-4 rounded-lg">
                <Link to="/dashboard/doctor/secure-communication" className="text-teal-600">Secure Communication</Link>
            </li>
        </ul>
    </motion.div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Logout handler
    const LogoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');  // redirect to login
    };
    

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>

                {/* Top Navbar */}
                <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mb-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="Profile"
                            className="rounded-full w-10 h-10"
                        />
                        <span className="text-lg font-semibold text-teal-600">Doctor Name</span>
                    </div>

                    {/* Logout Button */}
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                        onClick={LogoutHandler}
                    >
                        Logout
                    </button>
                </div>

                {/* Main Dashboard Content */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Manage Users Card */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        <h3 className="text-2xl font-bold text-teal-600 mb-4">Manage Users</h3>
                        <p className="text-gray-600">Control and edit user accounts.</p>
                        <Link to="/dashboard/doctor/manage-users" className="mt-4 text-teal-600 hover:text-teal-700 transition">
                            Go to User Management
                        </Link>
                    </motion.div>

                    {/* Manage Claims Card */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        <h3 className="text-2xl font-bold text-teal-600 mb-4">Manage Claims</h3>
                        <p className="text-gray-600">Handle claim submissions and updates.</p>
                        <Link to="/dashboard/doctor/manage-claims" className="mt-4 text-teal-600 hover:text-teal-700 transition">
                            Manage Claims
                        </Link>
                    </motion.div>

                    {/* View Reports Card */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        <h3 className="text-2xl font-bold text-teal-600 mb-4">View Reports</h3>
                        <p className="text-gray-600">Review system and user reports.</p>
                        <Link to="/dashboard/doctor/view-reports" className="mt-4 text-teal-600 hover:text-teal-700 transition">
                            View Reports
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
