// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Register = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('admin'); // Default role set to 'admin'
//     const [blockchainWallet, setBlockchainWallet] = useState('');
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         setError(null);

//         // Validate password confirmation
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         try {
//             const { data } = await axios.post('http://localhost:5000/api/auth/register', {
//                 name,
//                 email,
//                 password,
//                 confirmPassword,
//                 role,
//                 blockchainWallet,
//             });

//             // Store token and navigate upon successful registration
//             localStorage.setItem('token', data.token);
//             navigate('/dashboard'); 
//         } catch (error) {
//             // Handle and display error messages
//             setError(error.response?.data?.message || 'An error occurred during registration');
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
//             <motion.form
//                 className="bg-white p-8 rounded-xl shadow-lg w-96"
//                 onSubmit={submitHandler}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">Create an Account</h2>

//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <input
//                     type="text"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="email"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                     placeholder="Confirm Password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="text"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                     placeholder="Blockchain Wallet"
//                     value={blockchainWallet}
//                     onChange={(e) => setBlockchainWallet(e.target.value)}
//                     required
//                 />
//                 <select
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                 >
//                     <option value="admin">Admin</option>
//                     <option value="user">User</option>
//                 </select>
//                 <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200">
//                     Register
//                 </button>
//                 <p className="text-gray-600 mt-4 text-center">
//                     Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
//                 </p>
//             </motion.form>
//         </div>
//     );
// };

// export default Register;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('admin'); // Default role set to 'admin'
    const [blockchainWallet, setBlockchainWallet] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     setError(null);

    //     // Validate password confirmation
    //     if (password !== confirmPassword) {
    //         setError('Passwords do not match');
    //         return;
    //     }

    //     try {
    //         const { data } = await axios.post('http://localhost:5000/api/auth/register', {
    //             name,
    //             email,
    //             password,
    //             confirmPassword,
    //             role, // Send role as is
    //             blockchainWallet,
    //         });

    //         // Store token and navigate upon successful registration
    //         localStorage.setItem('token', data.token);
    //         navigate('/dashboard'); 
    //     } catch (error) {
    //         // Handle and display error messages
    //         setError(error.response?.data?.message || 'An error occurred during registration');
    //     }
    // };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
    
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                confirmPassword,
                role,
                blockchainWallet,
            });
    
            // Store the token and role in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', role); // Store role as well
    
            // Redirect based on role
            if (role === 'admin') {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/user');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during registration');
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
            <motion.form
                className="bg-white p-8 rounded-xl shadow-lg w-96"
                onSubmit={submitHandler}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">Create an Account</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <input
                    type="text"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Blockchain Wallet"
                    value={blockchainWallet}
                    onChange={(e) => setBlockchainWallet(e.target.value)}
                    required
                />
                <select
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    value={role}
                    onChange={(e) => setRole(e.target.value.toLowerCase())} // Ensure it is lowercase
                >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200">
                    Register
                </button>
                <p className="text-gray-600 mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
                </p>
            </motion.form>
        </div>
    );
};

export default Register;
