import React, { useState } from 'react';
import { FaUserMd } from 'react-icons/fa'; // Import doctor icon from React Icons
import HealthcarePopup from './HealthcarePopup'; // Adjust the import path as necessary
import ArrowIcon from './ArrowIcon';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        setMessages((prev) => [...prev, { sender: 'user', text: trimmedInput }]);
        setInput('');
        setLoading(true);

        try {
            const doctorResponse = await getDoctorResponse(trimmedInput);
            setMessages((prev) => [...prev, { sender: 'doctor', text: doctorResponse }]);
        } catch (error) {
            console.error('Error fetching doctor response:', error);
            setMessages((prev) => [...prev, { sender: 'doctor', text: "I'm having trouble responding right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const getDoctorResponse = async (userInput) => {
        const response = await fetch('http://localhost:5000/api/chatbot/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: userInput }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return data.answer?.replace(/[*_]/g, '') || "Sorry, I didn't get that.";
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const togglePopup = () => setIsPopupOpen(!isPopupOpen);
    const toggleOpen = () => setIsOpen(!isOpen);
    return (
        <div className={`chatbot fixed bottom-16 right-5 transition-transform duration-300 ${isOpen ? 'transform translate-y-0' : 'transform translate-y-full'} ${isDarkMode ? 'bg-gray-800' : 'bg-blue-500'} p-3 rounded-lg shadow-lg`}>
           <button onClick={toggleOpen} className="flex items-center">
                {isOpen ? (
                    <ArrowIcon /> // Use the ArrowIcon here
                ) : (
                    <ArrowIcon /> // You can use the same icon or a different one if needed
                )}
                <span>{isOpen ? 'Collapse' : 'Expand '}</span>
            </button>
            <button onClick={toggleDarkMode} aria-label={isDarkMode ? 'Light mode' : 'Dark mode'} className="dark-mode-button bg-gray-600 text-white rounded-full w-10 h-10 flex items-center justify-center ml-2">
                {isDarkMode ? '🌙' : '☀️'}
            </button>
            <button onClick={togglePopup} className="healthcare-button bg-green-500 text-white p-2 rounded mt-2">Healthcare Questions</button>

            {isOpen && (
                <div className={`chat-window ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-lg mt-2 p-4 shadow-md`}>
                    <div className={`messages max-h-60 overflow-y-auto p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message p-2 my-1 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 text-black mr-auto'}`}>
                                {msg.sender === 'doctor' && (
                                    <div className="flex items-center">
                                        <div className="doctor-avatar bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-2 transition-transform transform hover:scale-110">
                                            <FaUserMd className="w-6 h-6" />
                                        </div>
                                        <strong>Doctor:</strong> {msg.text}
                                    </div>
                                )}
                                {msg.sender === 'user' && (
                                    <div>
                                        <strong>You:</strong> {msg.text}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="loading text-gray-500">Doctor is typing...</div>}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className={`input w-full p-2 border rounded mt-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    />
                    <button onClick={handleSend} className="send-button bg-blue-700 text-white p-2 rounded mt-2">Send</button>
                </div>
            )}

            <HealthcarePopup isOpen={isPopupOpen} onClose={togglePopup} />
        </div>
    );
};

export default Chatbot;
