import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Compliance = () => {
  const [complianceFeatures, setComplianceFeatures] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch compliance features and audit logs on component mount
  useEffect(() => {
    const fetchComplianceFeatures = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/compliance');
        setComplianceFeatures(response.data);
      } catch (error) {
        console.error('Error fetching compliance data', error);
      }
    };

    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/audit-logs');
        setAuditLogs(response.data);
      } catch (error) {
        console.error('Error fetching audit logs', error);
      }
    };

    fetchComplianceFeatures();
    fetchAuditLogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-teal-600 mb-4">Compliance</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-teal-800">Compliance Features</h3>
        <ul>
          {complianceFeatures.length > 0 ? (
            complianceFeatures.map((feature) => (
              <li key={feature._id} className="mb-2">
                <strong>{feature.feature}</strong>: {feature.description} - 
                <span className={feature.isCompliant ? "text-green-600" : "text-red-600"}>
                  {feature.isCompliant ? 'Compliant' : 'Non-compliant'}
                </span>
              </li>
            ))
          ) : (
            <p>No compliance data found.</p>
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-teal-800">Audit Logs</h3>
        <ul>
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <li key={log._id} className="mb-2">
                <strong>{log.action}</strong> by {log.performedBy} on {new Date(log.timestamp).toLocaleString()}:
                <p>{log.details}</p>
              </li>
            ))
          ) : (
            <p>No audit logs found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Compliance;
