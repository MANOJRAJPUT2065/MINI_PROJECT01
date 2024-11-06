import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Particles from 'react-tsparticles';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({
        name: ' ',
        email: ' ',
        phone: '',
        profilePicture: 'https://via.placeholder.com/100',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [reports, setReports] = useState([]); // New state for reports
    const [reportFile, setReportFile] = useState(null); // State for the report file

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prevProfile => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setErrorMessage('Please select a valid image file.');
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    profilePicture: reader.result,
                }));
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleReportChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setReportFile(selectedFile);
        }
    };

    const handleSave = async () => {
        if (!file) {
            setErrorMessage('Please select an image to upload.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:5000/api/upload', formData);
            if (response.data && response.data.secure_url) {
                const imageUrl = response.data.secure_url;

                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    profilePicture: imageUrl,
                }));
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);
                setFile(null);
            } else {
                throw new Error('Image URL not found in response.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error?.message || 'Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

//     const handleReportUpload = async () => {
//         if (!reportFile) {
//             setErrorMessage('Please select a report to upload.');
//             return;
//         }

//         setLoading(true);
//         setErrorMessage('');
//         setSuccessMessage('');

//         try {
//             const formData = new FormData();
//             formData.append('report', reportFile);
// // TODO:
//             const response = await axios.post('http://localhost:5000/api/upload-report', formData);
//             if (response.data && response.data.secure_url) {
//                 const reportUrl = response.data.secure_url;
//                 setReports([...reports, reportUrl]); // Add the new report URL to the list
//                 setSuccessMessage('Report uploaded successfully!');
//                 setReportFile(null);
//             } else {
//                 throw new Error('Report URL not found in response.');
//             }
//         } catch (error) {
//             setErrorMessage(error.response?.data?.error?.message || 'Failed to upload report. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

const handleReportUpload = async () => {
    if (!reportFile) {
        setErrorMessage('Please select a report to upload.');
        return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
        const formData = new FormData();
        formData.append('report', reportFile);

        const response = await axios.post('http://localhost:5000/api/upload-report', formData);
        if (response.data && response.data.reportUrl) {
            const reportUrl = response.data.reportUrl; // Use the saved report URL
            setReports(prevReports => [...prevReports, reportUrl]); // Add the new report URL to the list
            setSuccessMessage('Report uploaded successfully!');
            setReportFile(null);
        } else {
            throw new Error('Report URL not found in response.');
        }
    } catch (error) {
        setErrorMessage(error.response?.data?.error?.message || 'Failed to upload report. Please try again.');
    } finally {
        setLoading(false);
    }
};


    // TODO: To get report from cloudinary
 

useEffect(() => {
    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reports');
            setReports(response.data); // Update the state with fetched reports
        } catch (error) {
            setErrorMessage('Failed to fetch reports.');
        }
    };
    fetchReports();
}, []);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };



    
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Particles
                id="tsparticles"
                options={{
                    particles: {
                        number: {
                            value: 50,
                            density: {
                                enable: true,
                                value_area: 800,
                            },
                        },
                        size: {
                            value: 3,
                        },
                        move: {
                            speed: 2,
                            direction: "none",
                            random: false,
                            straight: false,
                            bounce: false,
                            attract: {
                                enable: false,
                            },
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: "#ffffff",
                            opacity: 0.4,
                            width: 1,
                        },
                    },
                    interactivity: {
                        events: {
                            onhover: {
                                enable: true,
                                mode: "repulse",
                            },
                        },
                        modes: {
                            repulse: {
                                distance: 100,
                                duration: 1,
                            },
                        },
                    },
                }}
            />
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-8">
                <motion.h1
    className="text-3xl font-semibold text-blue-600 transition-transform duration-300 hover:scale-105 hover:text-blue-800 flex items-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
>
    Welcome {userProfile.name} 😊
</motion.h1>

                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <motion.div
                    className="bg-white shadow-lg rounded-lg p-6 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="font-semibold text-lg mb-4">My Profile</h2>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                    <div className="flex items-center mb-4">
                        <img
                            src={userProfile.profilePicture}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-2 border-blue-500 mr-4"
                        />
                        {isEditing ? (
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    name="name"
                                    value={userProfile.name}
                                    onChange={handleProfileChange}
                                    className="border p-2 rounded mb-2 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    
                                    placeholder="Name"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={userProfile.email}
                                    onChange={handleProfileChange}
                                    className="border p-2 rounded mb-2 w-full"
                                    placeholder="Email"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={userProfile.phone}
                                    onChange={handleProfileChange}
                                    className="border p-2 rounded mb-2 w-full"
                                    placeholder="Phone"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border p-2 rounded mb-2 w-full"
                                />
                                <button
                                    className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <p className="mb-2"><strong>Name:</strong> {userProfile.name}</p>
                                <p className="mb-2"><strong>Email:</strong> {userProfile.email}</p>
                                <p className="mb-2"><strong>Phone:</strong> {userProfile.phone}</p>
                                <button
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleEditToggle}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow-lg rounded-lg p-6 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="font-semibold text-lg mb-4">Upload Reports</h2>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*" // Adjust accepted file types as necessary
                        onChange={handleReportChange}
                        className="border p-2 rounded mb-4 w-full"
                    />
                    <button
                        className={`bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleReportUpload}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload Report'}
                    </button>
                    <h3 className="font-semibold mt-4">Uploaded Reports</h3>
                    <ul>
                    {reports.map((reportUrl, index) => (
    <li key={index} className="mb-2">
        <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Report {index + 1}
        </a>
    </li>
))}

</ul>

<ul>
                {reports.map((report) => (
                    <li key={report._id}>
                        <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                            View Report
                        </a>
                    </li>
                ))}
            </ul>
                    
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["Prescriptions", "Reports", "Appointments"].map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="font-semibold text-lg mb-4">My {item}</h2>
                            <p className="text-gray-600 mb-4">Manage your current {item.toLowerCase()}.</p>
                            <Link to={`/my-${item.toLowerCase()}`} className="text-blue-600 font-semibold hover:underline">
                                View {item}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

 