// src/components/DoctorDashboard/SecureCommunication.js
import React, { useState } from 'react';

const SecureCommunication = () => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        // Simulate secure message sending
        console.log('Message sent:', message);
        alert('Message sent securely!');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Secure Communication</h2>
            <textarea
                className="w-full p-2 border rounded"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button onClick={sendMessage} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">
                Send Message
            </button>
        </div>
    );
};

export default SecureCommunication;
