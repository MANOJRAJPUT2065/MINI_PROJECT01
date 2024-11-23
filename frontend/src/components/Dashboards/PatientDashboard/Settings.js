import React from 'react';

const Settings = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-teal-600">Settings</h1>
            <p className="mt-4 text-gray-700">Manage your account settings and preferences below.</p>

            {/* Account Details Section */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-gray-600">Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-gray-600">Current Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600">New Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Re-enter new password"
                        />
                    </div>
                </div>
                <button className="mt-4 bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition">
                    Update Password
                </button>
            </div>

            {/* Notification Preferences Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="email-notifications" className="h-5 w-5 text-teal-600" />
                        <label htmlFor="email-notifications" className="text-gray-600">
                            Email Notifications
                        </label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="sms-notifications" className="h-5 w-5 text-teal-600" />
                        <label htmlFor="sms-notifications" className="text-gray-600">
                            SMS Notifications
                        </label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" id="app-notifications" className="h-5 w-5 text-teal-600" />
                        <label htmlFor="app-notifications" className="text-gray-600">
                            App Notifications
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
