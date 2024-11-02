import React from 'react';
import InsurNavbar from './InsurNavbar';
import { motion } from 'framer-motion';

const About = () => {
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
                    About Us
                </motion.h1>
                <motion.p
                    className="text-xl mb-8 max-w-3xl drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    We are dedicated to providing comprehensive and affordable health insurance solutions to individuals and families. Our mission is to empower you to take control of your health and well-being.
                </motion.p>
            </div>

            {/* About Section */}
            <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
                <motion.h2
                    className="text-4xl font-bold mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    Why Choose Us?
                </motion.h2>
                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    We believe in providing transparent and reliable health insurance plans that cater to your unique needs. Our commitment to customer satisfaction is reflected in our:
                </motion.p>

                {/* About Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Benefit 1 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Wide Range of Plans</h3>
                        <p className="text-gray-300 text-sm">We offer a diverse selection of plans to suit different budgets and healthcare requirements.</p>
                    </motion.div>

                    {/* Benefit 2 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Exceptional Customer Support</h3>
                        <p className="text-gray-300 text-sm">Our dedicated team is always available to answer your questions and provide assistance.</p>
                    </motion.div>

                    {/* Benefit 3 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Digital Convenience</h3>
                        <p className="text-gray-300 text-sm">Manage your policy, file claims, and access information easily through our user-friendly platform.</p>
                    </motion.div>
                </div>
            </div>

            {/* Information Section */}
            <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
                <motion.h2
                    className="text-4xl font-bold mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    What is Health Insurance?
                </motion.h2>
                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    Health insurance is a type of insurance that covers the cost of medical expenses. It provides financial protection against unexpected healthcare costs, such as hospital stays, surgeries, and medications.
                </motion.p>

                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    When you purchase health insurance, you pay a premium, which is a regular payment to the insurance company. In return, the insurance company agrees to cover a portion or all of your medical expenses, depending on the terms of your policy.
                </motion.p>

                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    Health insurance is essential for protecting yourself and your family from the financial burden of unexpected medical events. It provides peace of mind knowing that you have financial support when you need it most.
                </motion.p>

                <motion.h2
                    className="text-3xl font-semibold mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                >
                    Fun Fact!
                </motion.h2>
                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                >
                    Did you know that health insurance can also cover preventive care, like annual check-ups and vaccinations? Investing in health insurance is not just about reacting to illness; it’s about proactively taking care of your health!
                </motion.p>
            </div>
        </div>
    );
};

export default About;
