import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage('Check your email for the reset link!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-500">
            <motion.form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">Forgot Password</h2>
                <motion.input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                    whileFocus={{ scale: 1.05, borderColor: '#6b46c1' }}
                />
                <motion.button
                    type="submit"
                    className={`w-full py-3 mb-4 text-white rounded focus:outline-none ${loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                    disabled={loading}
                    whileHover={{ scale: 1.05, backgroundColor: '#5a4e94' }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
                {message && (
                    <motion.p
                        initial={{ opacity: 0, translateY: -10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 text-center ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}
                    >
                        {message}
                    </motion.p>
                )}
            </motion.form>
        </div>
    );
};

export default ForgotPassword;
