import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const timeout = setTimeout(() => {
            if (token) {
                // Redirect authenticated users to their dashboard
                navigate('/dashboard/user'); // Adjust based on role if necessary
            }
        }, 3000); // Delay for 3 seconds

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, [navigate]);

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-4">The page you are looking for does not exist 😒😁.</p>
                <p className="text-gray-500 mb-4">Redirecting you shortly...</p>
                <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg" 
                    onClick={() => navigate('/')}
                >
                    Plz wait/ press later
                </button>
            </div>
        </div>
    );
};

export default NotFound;
