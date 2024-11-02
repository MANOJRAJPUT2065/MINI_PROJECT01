// src/components/InsurNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const InsurNavbar = () => {
    return (
        <nav className="bg-blue-800 p-4 shadow-lg">
            <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
                <Link to="/" className="text-2xl font-bold">
                    HealthCare System
                </Link>
                <div className="space-x-6">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/insurance" className="hover:underline">Health Insurance</Link>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
                <div className="space-x-4">
                    <Link to="/login">
                        <button className="bg-white text-blue-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default InsurNavbar;
