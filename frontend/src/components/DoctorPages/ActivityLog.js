// ActivityLog.js (previously AuditTrail.js)
import React, { useEffect, useState } from 'react';

function ActivityLog() {
  const [activityLogs, setActivityLogs] = useState([]);

  // Fetch activity log data from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/activity-logs')
      .then((response) => response.json())
      .then((data) => setActivityLogs(data))
      .catch((error) => console.error('Error fetching activity logs:', error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
      
      {/* Display a loading message while data is being fetched */}
      {activityLogs.length === 0 ? (
        <div>Loading activity logs...</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log) => (
              <tr key={log._id}>
                <td className="border border-gray-300 px-4 py-2">{log._id}</td>
                <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                <td className="border border-gray-300 px-4 py-2">{log.user}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ActivityLog;
