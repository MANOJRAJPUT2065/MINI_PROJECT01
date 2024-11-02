import React, { useState } from 'react';
import { motion } from 'framer-motion';

 import './tail.css'
const HealthcarePopup = ({ isOpen, onClose }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    if (!isOpen) return null;

    const handleQuestionClick = (question) => {
        setSelectedQuestion(selectedQuestion === question ? null : question);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-lg font-bold mb-4">Common Healthcare Questions</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-blue-600">Fever</h3>
                        <ul className="list-disc list-inside pl-4">
                            <li onClick={() => handleQuestionClick('fever1')} className="cursor-pointer hover:text-blue-500">What should I do if I have a fever?</li>
                            {selectedQuestion === 'fever1' && <p className="pl-4 text-gray-600">Drink plenty of fluids and rest. Consult a doctor if it persists.</p>}
                            <li onClick={() => handleQuestionClick('fever2')} className="cursor-pointer hover:text-blue-500">When should I see a doctor for a fever?</li>
                            {selectedQuestion === 'fever2' && <p className="pl-4 text-gray-600">If the fever is above 103°F or lasts more than three days.</p>}
                            <li onClick={() => handleQuestionClick('fever3')} className="cursor-pointer hover:text-blue-500">What medications can help reduce fever?</li>
                            {selectedQuestion === 'fever3' && <p className="pl-4 text-gray-600">Acetaminophen or ibuprofen can help reduce fever.</p>}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-600">Sneezing</h3>
                        <ul className="list-disc list-inside pl-4">
                            <li onClick={() => handleQuestionClick('sneezing1')} className="cursor-pointer hover:text-blue-500">What could be causing my sneezing?</li>
                            {selectedQuestion === 'sneezing1' && <p className="pl-4 text-gray-600">Allergies, colds, or irritants could be the cause.</p>}
                            <li onClick={() => handleQuestionClick('sneezing2')} className="cursor-pointer hover:text-blue-500">How can I relieve my sneezing?</li>
                            {selectedQuestion === 'sneezing2' && <p className="pl-4 text-gray-600">Try antihistamines or nasal sprays for relief.</p>}
                            <li onClick={() => handleQuestionClick('sneezing3')} className="cursor-pointer hover:text-blue-500">Should I be worried about persistent sneezing?</li>
                            {selectedQuestion === 'sneezing3' && <p className="pl-4 text-gray-600">If it lasts long, consult a healthcare provider.</p>}
                        </ul>
                    </div>
                    {/* Add more categories as needed */}
                </div>
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Close</button>
            </motion.div>
        </div>
    );
};

export default HealthcarePopup;
