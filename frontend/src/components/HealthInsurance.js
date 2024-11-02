// Generate simple ui for insurance

import React from 'react';
import InsurNavbar from './InsurNavbar';
import { motion } from 'framer-motion';

const HealthInsurance = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-800 to-gray-900 p-8 text-white">
            {/* InsurNavbar */}
            <InsurNavbar />

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center py-12">
                <motion.h1
                    className="text-5xl font-bold drop-shadow-lg mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    Health Insurance
                </motion.h1>
                <motion.p
                    className="text-xl mb-8 max-w-3xl drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    Secure your health and well-being with our comprehensive health insurance plans.
                </motion.p>
            </div>

            {/* Insurance Plans Section */}
            <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
                <motion.h2
                    className="text-4xl font-bold mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    Our Insurance Plans
                </motion.h2>
                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    We offer a range of health insurance plans designed to meet your individual needs and budget.
                </motion.p>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Plan 1 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Basic Plan</h3>
                        <p className="text-gray-300 text-sm">Essential coverage for common medical expenses.</p>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 transition">Learn More</button>
                    </motion.div>

                    {/* Plan 2 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Standard Plan</h3>
                        <p className="text-gray-300 text-sm">Comprehensive coverage for a wide range of medical needs.</p>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 transition">Learn More</button>
                    </motion.div>

                    {/* Plan 3 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Premium Plan</h3>
                        <p className="text-gray-300 text-sm">Exclusive coverage with enhanced benefits and services.</p>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 transition">Learn More</button>
                    </motion.div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
                <motion.h2
                    className="text-3xl font-semibold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                >
                    Ready to Protect Your Health?
                </motion.h2>
                <motion.button
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 transform hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get a Quote
                </motion.button>
            </div>
        </div>
    );
};

export default HealthInsurance;