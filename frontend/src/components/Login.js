

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const [role, setRole] = useState('user'); // Default role set to 'user'
//     const navigate = useNavigate();

//    /*
//     const submitHandler = async (e) => {
//         e.preventDefault();
//         setError(null);

//         try {
//             // Include the role in the request body
//             const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
//             localStorage.setItem('token', data.token);
//             navigate(`/dashboard/${role}`);
//         } catch (error) {
//             setError(error.response?.data?.message || 'An error occurred');
//         }
//     };
// */
//  const submitHandler = async (e) => {
//         e.preventDefault();
//         setError(null);

//         try {
//             // Send login request with email, password, and role
//             const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });

//             // Store token and role in localStorage
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('role', role);

//             // Redirect based on role
//             if (role === 'admin') {
//                 navigate('/dashboard/admin');
//             } else {
//                 navigate('/dashboard/user');
//             }
//         } catch (error) {
//             setError(error.response?.data?.message || 'An error occurred');
//         }
//     };


//     return (
//         <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500 flex justify-center items-center relative overflow-hidden">
//             <motion.div
//                 className="absolute inset-0 bg-no-repeat bg-cover"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 2 }}
//                 style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?health')" }} // Change image URL as needed
//             />
//             <motion.form
//                 className="bg-white p-8 rounded-xl shadow-lg w-96 z-10"
//                 onSubmit={submitHandler}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Welcome Back</h2>

//                 {error && (
//                     <motion.div 
//                         className="text-red-500 mb-4"
//                         initial={{ opacity: 0 }} 
//                         animate={{ opacity: 1 }} 
//                         transition={{ duration: 0.5 }}
//                     >
//                         {error}
//                     </motion.div>
//                 )}

//                 <input
//                     type="email"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />

//                 <div className="mb-4">
//                     <label className="mr-4">
//                         <input
//                             type="radio"
//                             value="user"
//                             checked={role === 'user'}
//                             onChange={() => setRole('user')}
//                             required
//                         />
//                         User
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="admin" // Ensure it's lowercase
//                             checked={role === 'admin'}
//                             onChange={() => setRole('admin')}
//                             required
//                         />
//                         Admin
//                     </label>
//                 </div>

//                 <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-105">
//                     Login
//                 </button>
//                 <p className="text-gray-600 mt-4 text-center">
//                     Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
//                 </p>
//             </motion.form>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
            localStorage.setItem('token', data.token);
            navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-500 to-purple-500 flex justify-center items-center relative overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-no-repeat bg-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?nature')" }}
            />
            <motion.form
                className="bg-white p-8 rounded-xl shadow-lg w-96 z-10"
                onSubmit={submitHandler}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">Welcome Back</h2>

                {error && (
                    <motion.div 
                        className="text-red-500 mb-4"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}

                <motion.input
                    type="email"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email"
                    whileFocus={{ scale: 1.05 }}
                />
                <motion.input
                    type="password"
                    className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                    whileFocus={{ scale: 1.05 }}
                />

                <div className="mb-4">
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="user"
                            checked={role === 'user'}
                            onChange={() => setRole('user')}
                            required
                        />
                        User
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="admin"
                            checked={role === 'admin'}
                            onChange={() => setRole('admin')}
                            required
                        />
                        Admin
                    </label>
                </div>

                <motion.button 
                    type="submit" 
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 transform hover:scale-105"
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </motion.button>

                <p className="text-gray-600 mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-purple-600 hover:underline">Register</Link>
                </p>
                <p className="text-gray-600 mt-4 text-center">
                    Forgot your password? <Link to="/forgot-password" className="text-purple-600 hover:underline">Reset it</Link>
                </p>
            </motion.form>
        </div>
    );
};

export default Login;
