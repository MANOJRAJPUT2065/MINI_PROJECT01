import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                newPassword,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-500">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Reset Password</h2>
                <form onSubmit={handleReset}>
                    <motion.input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
                        whileFocus={{ scale: 1.05, borderColor: '#38a169' }}
                    />
                    <motion.input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
                        whileFocus={{ scale: 1.05, borderColor: '#38a169' }}
                    />
                    <motion.button
                        type="submit"
                        className={`w-full py-3 mb-4 text-white rounded focus:outline-none ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                        disabled={loading}
                        whileHover={{ scale: 1.05, backgroundColor: '#2f855a' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                </form>
                {message && (
                    <motion.p
                        initial={{ opacity: 0, translateY: -10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 text-center ${message.includes('do not match') ? 'text-red-500' : 'text-green-500'}`}
                    >
                        {message}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
