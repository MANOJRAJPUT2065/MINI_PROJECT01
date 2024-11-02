import React from 'react';
import InsurNavbar from './InsurNavbar';
import { motion } from 'framer-motion';
import Chatbot from './Chatbot'; // Import the Chatbot

const ContactUs = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/contact/send', {  
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Message sent successfully!');
                e.target.reset(); // Clear the form
            } else {
                alert('Error sending message.');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-800 to-gray-900 p-8 text-white">
            <InsurNavbar /> 
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center py-12">
                <motion.h1 className="text-5xl font-bold drop-shadow-lg mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}>
                    Contact Us
                </motion.h1>
                <motion.p className="text-xl mb-8 max-w-3xl drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}>
                    We’re here to help! If you have any questions or need assistance, please reach out to us.
                </motion.p>
            </div>
            <div className="max-w-6xl mx-auto mt-16 py-8">
                <motion.h2 className="text-4xl font-bold text-center mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}>
                    Get in Touch
                </motion.h2>
                <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}>
                            <label className="block text-gray-200 mb-2" htmlFor="name">Name</label>
                            <input className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text" id="name" required />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.7 }}>
                            <label className="block text-gray-200 mb-2" htmlFor="email">Email</label>
                            <input className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="email" id="email" required />
                        </motion.div>
                    </div>
                    <motion.div className="mt-6" initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.9 }}>
                        <label className="block text-gray-200 mb-2" htmlFor="message">Message</label>
                        <textarea className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="message" rows="4" required></textarea>
                    </motion.div>
                    <motion.button className="mt-6 w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                        type="submit" initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.1 }}>
                        Send Message
                    </motion.button>
                </form>
            </div>
            <div className="max-w-6xl mx-auto mt-16 py-8 text-center">
                <motion.h2 className="text-4xl font-bold mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}>
                    Our Contact Information
                </motion.h2>
                <motion.p className="text-xl max-w-4xl mx-auto mb-4 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}>
                    Phone: +91 7006808150
                </motion.p>
                <motion.p className="text-xl max-w-4xl mx-auto mb-4 text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}>
                    Email: sit_londe@gmail.com
                </motion.p>
                <motion.p className="text-xl max-w-4xl mx-auto text-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.7 }}>
                    Address: Tumkur SIT Back Gate, 572103
                </motion.p>
            </div>
            <Chatbot /> {/* Add the Chatbot component here */}
        </div>
    );
};

export default ContactUs;
