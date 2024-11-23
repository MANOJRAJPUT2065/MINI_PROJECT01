// components/DoctorPages/SystemSettings.js
import React, { useState } from 'react';

function SystemSettings() {
    const [settings, setSettings] = useState({
        notifications: {
            emailAlerts: true,
            smsAlerts: false,
        },
        account: {
            name: "Doctor Name",
            email: "doctor@example.com",
        },
        security: {
            enable2FA: false,
            sessionTimeout: 30, // in minutes
        },
    });

    const handleInputChange = (section, key, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const handleSaveSettings = () => {
        // Simulate saving to a server
        console.log("Settings saved:", settings);
        alert("Settings saved successfully!");
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-teal-600 mb-6">System Settings</h2>
            
            {/* Notification Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Notification Settings</h3>
                <label className="block mb-2">
                    <input
                        type="checkbox"
                        checked={settings.notifications.emailAlerts}
                        onChange={(e) =>
                            handleInputChange("notifications", "emailAlerts", e.target.checked)
                        }
                    />
                    <span className="ml-2">Email Alerts</span>
                </label>
                <label className="block">
                    <input
                        type="checkbox"
                        checked={settings.notifications.smsAlerts}
                        onChange={(e) =>
                            handleInputChange("notifications", "smsAlerts", e.target.checked)
                        }
                    />
                    <span className="ml-2">SMS Alerts</span>
                </label>
            </div>

            {/* Account Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Settings</h3>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Name</label>
                    <input
                        type="text"
                        value={settings.account.name}
                        onChange={(e) =>
                            handleInputChange("account", "name", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-600">Email</label>
                    <input
                        type="email"
                        value={settings.account.email}
                        onChange={(e) =>
                            handleInputChange("account", "email", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            {/* Security Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Security Settings</h3>
                <label className="block mb-4">
                    <input
                        type="checkbox"
                        checked={settings.security.enable2FA}
                        onChange={(e) =>
                            handleInputChange("security", "enable2FA", e.target.checked)
                        }
                    />
                    <span className="ml-2">Enable Two-Factor Authentication (2FA)</span>
                </label>
                <div>
                    <label className="block mb-1 text-gray-600">Session Timeout (minutes)</label>
                    <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                            handleInputChange("security", "sessionTimeout", parseInt(e.target.value))
                        }
                        className="w-full p-2 border rounded"
                        min={5}
                        max={120}
                    />
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSaveSettings}
                className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
            >
                Save Settings
            </button>
        </div>
    );
}

export default SystemSettings;
