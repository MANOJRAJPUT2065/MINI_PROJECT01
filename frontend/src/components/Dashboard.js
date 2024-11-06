    // import React from 'react';
    // import { motion } from 'framer-motion';
    // import InsurNavbar from '../components/Pages/InsurNavbar';
    // import {useNavigate } from 'react-router-dom';
    // import img1 from '../assets/Personal_Health_Insights.jpg';
    // import img2 from '../assets/Secure_Health_Data.jpg';
    // import img3 from '../assets/Verified_Professionals.jpg';
    // import img4 from '../assets/Comprhensive.jpg';
    // import img5 from '../assets/Affordable_Plan.jpg';
    // import img6 from '../assets/Cashless_Hosp.jpg';

    // const HomeScreen = () => {
    //     const navigate = useNavigate();

        
    //     const handleGetStarted = () => {
    //         const token = localStorage.getItem('token');
    //         let userRole = null;
        
    //         if (token) {
    //             try {
    //                 const payload = atob(token.split('.')[1]);
    //                 userRole = JSON.parse(payload).role; // Extract role from payload
    //             } catch (error) {
    //                 console.error("Error decoding token:", error);
    //             }
    //         }
        
    //         if (userRole === 'admin') {
    //             navigate('/dashboard/admin');
    //         } else if (userRole === 'user') {
    //             navigate('/dashboard/user');
    //         } else {
    //             navigate('/login');
    //         }
    //     };
        

    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-800 to-gray-900 p-8 text-white">
    //             {/* InsurNavbar */}
    //             <InsurNavbar />

    //             {/* Hero Section */}
    //             <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center py-12">
    //                 <motion.h1
    //                     className="text-5xl font-bold drop-shadow-lg mb-6"
    //                     initial={{ opacity: 0, y: -50 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 1.2 }}
    //                 >
    //                     Welcome to Your Health Companion
    //                 </motion.h1>
    //                 <motion.p
    //                     className="text-xl mb-8 max-w-3xl drop-shadow-lg"
    //                     initial={{ opacity: 0, y: 30 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 1.2, delay: 0.3 }}
    //                 >
    //                     Manage your healthcare needs with ease. Access your medical records, consult with professionals, and stay on top of your health, all in one place.
    //                 </motion.p>
    //                 <motion.button
    //                     className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 transform hover:scale-105"
    //                     whileHover={{ scale: 1.1 }}
    //                     whileTap={{ scale: 0.95 }}
    //                     onClick={handleGetStarted} // Updated to handle role-based navigation
    //                 >
    //                     Get Started
    //                 </motion.button>
    //             </div>

    //             {/* Healthcare Benefits Section */}
    //             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
    //                 {/* Benefit 1 */}
    //                 <motion.div
    //                     className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-82 flex flex-col items-center justify-center"
    //                     initial={{ opacity: 0, y: 30 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 0.7, delay: 0.5 }}
    //                 >
    //                     <img src={img1} alt="Personal Health Insights" className="mx-auto mb-4 w-34 h-34 object-contain" />
    //                     <h3 className="text-lg font-semibold mb-3">Personalized Health Insights</h3>
    //                     <p className="text-gray-300 text-sm">Get customized health suggestions and track your medical history efficiently.</p>
    //                 </motion.div>

    //                 {/* Benefit 2 */}
    //                 <motion.div
    //                     className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-82 flex flex-col items-center justify-center"
    //                     initial={{ opacity: 0, y: 30 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 0.7, delay: 0.7 }}
    //                 >
    //                     <img src={img3} alt="Verified Professionals" className="mx-auto mb-4 w-64 h-44 object-contain" />
    //                     <h3 className="text-lg font-semibold mb-3">Verified Professionals</h3>
    //                     <p className="text-gray-300 text-sm">Consult certified and verified healthcare providers at your convenience.</p>
    //                 </motion.div>

    //                 {/* Benefit 3 */}
    //                 <motion.div
    //                     className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-82 flex flex-col items-center justify-center"
    //                     initial={{ opacity: 0, y: 30 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 0.7, delay: 0.9 }}
    //                 >
    //                     <img src={img2} alt="Secure Health Data" className="mx-auto mb-4 w-34 h-34 object-contain" />
    //                     <h3 className="text-lg font-semibold mb-3">Secure Health Data</h3>
    //                     <p className="text-gray-300 text-sm">Your medical records are encrypted and stored securely for total privacy.</p>
    //                 </motion.div>
    //             </div>

    //             {/* Health Insurance Section */}
    //             <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
    //                 <motion.h2
    //                     className="text-4xl font-bold mb-8"
    //                     initial={{ opacity: 0, y: -50 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 1.2 }}
    //                 >
    //                     Health Insurance: Secure Your Future
    //                 </motion.h2>
    //                 <motion.p
    //                     className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
    //                     initial={{ opacity: 0, y: 30 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 1.2, delay: 0.3 }}
    //                 >
    //                     Health insurance helps protect you and your loved ones from unexpected healthcare expenses. It covers a range of services from medical consultations to surgeries, helping to reduce the financial burden in case of a medical emergency.
    //                 </motion.p>

    //                 {/* Health Insurance Benefits Section */}
    //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //                     {/* Benefit 1 */}
    //                     <motion.div
    //                         className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
    //                         initial={{ opacity: 0, y: 30 }}
    //                         animate={{ opacity: 1, y: 0 }}
    //                         transition={{ duration: 0.7, delay: 0.5 }}
    //                     >
    //                         <img src={img4} alt="Comprehensive Coverage" className="mx-auto mb-4 w-74 h-74 object-contain" />
    //                         <h3 className="text-lg font-semibold mb-3">Comprehensive Coverage</h3>
    //                         <p className="text-gray-300 text-sm">Get coverage for various medical services, including hospital stays, surgeries, and more.</p>
    //                     </motion.div>

    //                     {/* Benefit 2 */}
    //                     <motion.div
    //                         className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
    //                         initial={{ opacity: 0, y: 30 }}
    //                         animate={{ opacity: 1, y: 0 }}
    //                         transition={{ duration: 0.7, delay: 0.7 }}
    //                     >
    //                         <img src={img5} alt="Affordable Plans" className="mx-auto mb-4 w-64 h-64 object-contain" />
    //                         <h3 className="text-lg font-semibold mb-3">Affordable Plans</h3>
    //                         <p className="text-gray-300 text-sm">Choose from a variety of plans that fit your budget and healthcare needs.</p>
    //                     </motion.div>

    //                     {/* Benefit 3 */}
    //                     <motion.div
    //                         className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
    //                         initial={{ opacity: 0, y: 30 }}
    //                         animate={{ opacity: 1, y: 0 }}
    //                         transition={{ duration: 0.7, delay: 0.9 }}
    //                     >
    //                         <img src={img6} alt="Cashless Hospitalization" className="mx-auto mb-4 w-64 h-64 object-contain" />
    //                         <h3 className="text-lg font-semibold mb-3">Cashless Hospitalization</h3>
    //                         <p className="text-gray-300 text-sm">Enjoy the convenience of cashless hospitalization at network hospitals.</p>
    //                     </motion.div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

    // export default HomeScreen;
        



    import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InsurNavbar from '../components/Pages/InsurNavbar';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/Personal_Health_Insights.jpg';
import img2 from '../assets/Secure_Health_Data.jpg';
import img3 from '../assets/Verified_Professionals.jpg';
import img4 from '../assets/Comprhensive.jpg';
import img5 from '../assets/Affordable_Plan.jpg';
import img6 from '../assets/Cashless_Hosp.jpg';

const HomeScreen = () => {
    const navigate = useNavigate();
    const [showRoleModal, setShowRoleModal] = useState(false);

    // Function to open the role selection modal
    const handleGetStarted = () => {
        setShowRoleModal(true);
    };

    // Function to handle the role selection and navigate accordingly
    const handleRoleSelection = (role) => {
        localStorage.setItem('role', role); // Store the selected role in localStorage
        setShowRoleModal(false); // Close the modal

        if (role === 'user') {
            navigate('/dashboard/user');
        } else if (role === 'insurer') {
            navigate('/dashboard/insurer');
        } else {
            navigate('/login'); // Redirect to login if no role selected
        }
    };

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
                    Welcome to Your Health Companion
                </motion.h1>
                <motion.p
                    className="text-xl mb-8 max-w-3xl drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    Manage your healthcare needs with ease. Access your medical records, consult with professionals, and stay on top of your health, all in one place.
                </motion.p>
                <motion.button
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 transform hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted} // Updated to show the modal for role selection
                >
                    Get Started
                </motion.button>
            </div>

            {/* Healthcare Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {/* Benefit 1 */}
                <motion.div
                    className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-82 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    <img src={img1} alt="Personal Health Insights" className="mx-auto mb-4 w-34 h-34 object-contain" />
                    <h3 className="text-lg font-semibold mb-3">Personalized Health Insights</h3>
                    <p className="text-gray-300 text-sm">Get customized health suggestions and track your medical history efficiently.</p>
                </motion.div>

                {/* Benefit 2 */}
                <motion.div
                    className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-82 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                >
                    <img src={img3} alt="Verified Professionals" className="mx-auto mb-4 w-64 h-44 object-contain" />
                    <h3 className="text-lg font-semibold mb-3">Verified Professionals</h3>
                    <p className="text-gray-300 text-sm">Consult certified and verified healthcare providers at your convenience.</p>
                </motion.div>

                {/* Benefit 3 */}
                <motion.div
                    className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-82 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                >
                    <img src={img2} alt="Secure Health Data" className="mx-auto mb-4 w-34 h-34 object-contain" />
                    <h3 className="text-lg font-semibold mb-3">Secure Health Data</h3>
                    <p className="text-gray-300 text-sm">Your medical records are encrypted and stored securely for total privacy.</p>
                </motion.div>
            </div>

 {/* Health Insurance Section */}
 <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
                <motion.h2
                    className="text-4xl font-bold mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    Health Insurance: Secure Your Future
                </motion.h2>
                <motion.p
                    className="text-xl max-w-4xl mx-auto mb-12 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    Health insurance helps protect you and your loved ones from unexpected healthcare expenses. It covers a range of services from medical consultations to surgeries, helping to reduce the financial burden in case of a medical emergency.
                </motion.p>

                {/* Health Insurance Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Benefit 1 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <img src={img4} alt="Comprehensive Coverage" className="mx-auto mb-4 w-74 h-74 object-contain" />
                        <h3 className="text-lg font-semibold mb-3">Comprehensive Coverage</h3>
                        <p className="text-gray-300 text-sm">Get coverage for various medical services, including hospital stays, surgeries, and more.</p>
                    </motion.div>

                    {/* Benefit 2 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <img src={img5} alt="Affordable Plans" className="mx-auto mb-4 w-64 h-64 object-contain" />
                        <h3 className="text-lg font-semibold mb-3">Affordable Plans</h3>
                        <p className="text-gray-300 text-sm">Choose from a variety of plans that fit your budget and healthcare needs.</p>
                    </motion.div>

                    {/* Benefit 3 */}
                    <motion.div
                        className="bg-white bg-opacity-10 p-9 rounded-lg shadow-lg hover:bg-opacity-20 transition duration-300 h-100 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                    >
                        <img src={img6} alt="Cashless Hospitalization" className="mx-auto mb-4 w-64 h-64 object-contain" />
                        <h3 className="text-lg font-semibold mb-3">Cashless Hospitalization</h3>
                        <p className="text-gray-300 text-sm">Enjoy the convenience of cashless hospitalization at network hospitals.</p>
                    </motion.div>
                </div>
                </div>



            {/* Role Selection Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
                        <h3 className="text-2xl font-semibold mb-4">Select Your Role</h3>
                        <div className="space-y-4">
                            <button
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                onClick={() => handleRoleSelection('user')}
                            >
                                User
                            </button>
                            <button
                                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                                onClick={() => handleRoleSelection('insurer')}
                            >
                                Insurer
                            </button>
                            <button
                                className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                                onClick={() => handleRoleSelection('admin')}
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
