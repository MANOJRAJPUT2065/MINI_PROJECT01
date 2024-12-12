// import React from 'react';
// import { Line } from 'react-chartjs-2'; // For Line Chart (Claim Status Progress)
// import { Bar } from 'react-chartjs-2'; // For Bar Chart (Claim Submission Stats)
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { Link } from 'react-router-dom';
// // Register chart components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const PatientDashboardOverview = () => {
//     // Example data for line chart (Claim status progress)
//     const claimStatusData = {
//         labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // X-axis (weeks)
//         datasets: [
//             {
//                 label: 'Claim Status Progress',
//                 data: [20, 40, 60, 80], // Progress percentages
//                 fill: true,
//                 backgroundColor: 'rgba(38, 211, 168, 0.2)', // light teal
//                 borderColor: 'rgba(38, 211, 168, 1)',
//                 borderWidth: 2,
//             },
//         ],
//     };

//     // Example data for bar chart (Claim submissions per month)
//     const claimSubmissionStats = {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//         datasets: [
//             {
//                 label: 'Claims Submitted',
//                 data: [3, 5, 2, 8, 6, 4], // Number of claims submitted
//                 backgroundColor: 'rgba(38, 211, 168, 1)', // teal color
//                 borderColor: 'rgba(38, 211, 168, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };

//     return (
//         <div className="flex flex-col space-y-6">
//         {/* Dashboard Title */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h1 className="text-3xl font-semibold text-teal-600">Dashboard Overview</h1>
//             <p className="mt-2 text-gray-600">
//                 Welcome to your personalized dashboard. Here you can manage your insurance claims, track their status, and access important reports.
//             </p>
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Claim Submission Card */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h3 className="text-2xl font-bold text-teal-600 mb-4">Submit Insurance Claim</h3>
//                 <p className="text-gray-600">Start your claim process and submit necessary documents.</p>
//                 <Link to="/dashboard/patient/claim-submission">
//                     <button className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
//                         Go to Claim Submission
//                     </button>
//                 </Link>
//             </div>

//             {/* Track Claims Card */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h3 className="text-2xl font-bold text-teal-600 mb-4">Track Claim Status</h3>
//                 <p className="text-gray-600">Keep an eye on the status of your ongoing claims.</p>
//                 <Link to="/dashboard/patient/track-claims">
//                     <button className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
//                         Track Your Claims
//                     </button>
//                 </Link>
//             </div>

//             {/* Reports Card */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h3 className="text-2xl font-bold text-teal-600 mb-4">View Reports</h3>
//                 <p className="text-gray-600">Access your medical and claim reports for review.</p>
//                 <Link to="/dashboard/patient/view-reports">
//                     <button className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
//                         View Reports
//                     </button>
//                 </Link>
//             </div>
//         </div>

//         {/* Account Settings Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold text-teal-600 mb-4">Account Settings</h3>
//             <p className="text-gray-600">Manage your personal and account settings here.</p>
//             <Link to="/dashboard/patient/settings">
//                 <button className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
//                     Manage Settings
//                 </button>
//             </Link>
//         </div>

//         {/* New Section: Charts for Claim Statistics */}
//         <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
//             <h3 className="text-2xl font-bold text-teal-600 mb-4">Claim Status and Submissions</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {/* Line Chart: Claim Progress */}
//                 <div>
//                     <h4 className="text-xl font-semibold text-teal-600 mb-2">Claim Status Progress</h4>
//                     <Line data={claimStatusData} options={{ responsive: true, maintainAspectRatio: true }} />
//                 </div>

//                 {/* Bar Chart: Claims Submitted */}
//                 <div>
//                     <h4 className="text-xl font-semibold text-teal-600 mb-2">Claim Submissions Per Month</h4>
//                     <Bar data={claimSubmissionStats} options={{ responsive: true, maintainAspectRatio: true }} />
//                 </div>
//             </div>
//         </div>

//         {/* Recent Activities */}
//         <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
//             <h3 className="text-2xl font-bold text-teal-600 mb-4">Recent Activities</h3>
//             <ul className="space-y-4 text-gray-600">
//                 <li>Claim #1234 successfully submitted on 10/01/2024</li>
//                 <li>Claim #1235 is in progress, awaiting document verification</li>
//                 <li>Your report for Claim #1236 is now available for download</li>
//             </ul>
//         </div>

//         {/* Notifications Section */}
//         <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
//             <h3 className="text-2xl font-bold text-teal-600 mb-4">Notifications</h3>
//             <ul className="space-y-4 text-gray-600">
//                 <li>You have a new update on your claim #1234</li>
//                 <li>Your recent medical report has been updated</li>
//                 <li>Reminder: Submit your claim documents by 11/30/2024</li>
//             </ul>
//         </div>
//     </div>
//     );
// };

// export default PatientDashboardOverview;



import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const PatientDashboardOverview = () => {
    const [claimStatusData, setClaimStatusData] = useState([]);
    const [claimSubmissionData, setClaimSubmissionData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statusResponse = await fetch('http://localhost:5000/api/patient/claim-status-progress');
                const statusData = await statusResponse.json();
                setClaimStatusData(statusData.data);

                const submissionsResponse = await fetch('http://localhost:5000/api/patient/claim-submissions');
                const submissionsData = await submissionsResponse.json();
                setClaimSubmissionData(submissionsData.data);

                const activitiesResponse = await fetch('http://localhost:5000/api/patient/recent-activities');
                const activitiesData = await activitiesResponse.json();
                setRecentActivities(activitiesData.activities);

                const notificationsResponse = await fetch('http://localhost:5000/api/patient/notifications');
                const notificationsData = await notificationsResponse.json();
                setNotifications(notificationsData.notifications);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Fallback to static data if there's an error
                setClaimStatusData([20, 40, 60, 80]);
                setClaimSubmissionData([3, 5, 2, 8, 6, 4]);
                setRecentActivities([
                    { claimId: '1234', message: 'Successfully submitted on 10/01/2024' },
                    { claimId: '1235', message: 'In progress, awaiting document verification' },
                    { claimId: '1236', message: 'Report available for download' },
                ]);
                setNotifications([
                    { message: 'You have a new update on claim #1234' },
                    { message: 'Your recent medical report has been updated' },
                    { message: 'Reminder: Submit your claim documents by 11/30/2024' },
                ]);
            }
        };

        fetchData();
    }, []);

    const lineChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Claim Status Progress',
                data: claimStatusData,
                fill: true,
                backgroundColor: 'rgba(38, 211, 168, 0.2)',
                borderColor: 'rgba(38, 211, 168, 1)',
                borderWidth: 2,
            },
        ],
    };

    const barChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Claims Submitted',
                data: claimSubmissionData,
                backgroundColor: 'rgba(38, 211, 168, 1)',
                borderColor: 'rgba(38, 211, 168, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xl font-semibold text-teal-600 mb-2">Claim Status Progress</h4>
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-teal-600 mb-2">Claim Submissions Per Month</h4>
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-teal-600 mb-4">Recent Activities</h3>
                <ul className="space-y-4 text-gray-600">
                    {recentActivities.map((activity, index) => (
                        <li key={index}>{activity.message}</li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-teal-600 mb-4">Notifications</h3>
                <ul className="space-y-4 text-gray-600">
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification.message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PatientDashboardOverview;
