// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UserManagement = () => {
//   // State variables for storing users, roles, and activity logs
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState(['admin', 'claims-approver', 'auditor']); // Available roles
//   const [activityLogs, setActivityLogs] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newUser, setNewUser] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);

//   // Get token from localStorage
//   const token = localStorage.getItem('authToken');

//   // Create an axios instance with the token in the Authorization header
//   const axiosInstance = axios.create({
//     baseURL: 'http://localhost:5000/api', // Your API base URL
//     headers: {
//       'Authorization': `Bearer ${token}`
//     },
//   });

//   // Fetch users and activity logs on component mount
//   useEffect(() => {
//     fetchUsers();
//     fetchActivityLogs();
//   }, []);

//   // Fetch users from the backend
//   const fetchUsers = async () => {
//     try {
//       const response = await axiosInstance.get('/users');
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   // Fetch activity logs from the backend
//   const fetchActivityLogs = async () => {
//     try {
//       const response = await axiosInstance.get('/users/activity-log');
//       setActivityLogs(response.data);
//     } catch (error) {
//       console.error('Error fetching activity logs:', error);
//     }
//   };

//   // Create a new user
 

//   const handleCreateUser = async (userData) => {
//     try {
//       // Get the token from localStorage (or sessionStorage or cookies)
//       const token = localStorage.getItem('token');
  
//       // Check if the token is available
//       if (!token) {
//         console.error('No token found. Please log in first.');
//         return;
//       }
  
//       // Send the POST request with the token in the Authorization header
//       const response = await axios.post('http://localhost:5000/api/users', userData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Attach the token here
//         },
//       });
  
//       console.log('User created successfully', response.data);
//     } catch (error) {
//       console.error('Error creating user:', error.response?.data || error.message);
//     }
//   };
  
//   // Example of how to call handleCreateUser:
//   const onSubmit = (event) => {
//     event.preventDefault();
//     const userData = {
//       firstName: newUser.firstName,
//       lastName: newUser.lastName,
//       email: newUser.email,
//       password: newUser.password,
//       role: newUser.role,
//     };
    
//     console.log('User Data:', userData); // Log the data to check if it's correct
    
//     handleCreateUser(userData);
//   };
  
  

//   // Deactivate a user
//   const handleDeactivateUser = async (userId) => {
//     try {
//       const response = await axiosInstance.put(`/users/${userId}/deactivate`);
//       alert(response.data.message);
//       fetchUsers(); // Refresh the users list after deactivation
//     } catch (error) {
//       console.error('Error deactivating user:', error);
//       alert('Error deactivating user');
//     }
//   };

//   // Assign a new role to a user
//   const handleChangeUserRole = async (userId, newRole) => {
//     try {
//       const response = await axiosInstance.put(`/users/${userId}/role`, { role: newRole });
//       alert(response.data.message);
//       fetchUsers(); // Refresh the users list after role update
//     } catch (error) {
//       console.error('Error changing user role:', error);
//       alert('Error changing user role');
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-3xl font-bold text-teal-600">User Management</h2>

//       {/* Create User Section */}
//       <div className="my-4">
//         <h3 className="text-2xl font-semibold text-teal-500">Create New User</h3>
//         <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
//           <div className="my-2">
//             <input
//               type="text"
//               placeholder="First Name"
//               value={newUser.firstName}
//               onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>
//           <div className="my-2">
//             <input
//               type="text"
//               placeholder="Last Name"
//               value={newUser.lastName}
//               onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>
//           <div className="my-2">
//             <input
//               type="email"
//               placeholder="Email"
//               value={newUser.email}
//               onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>
//           <div className="my-2">
//             <select
//               value={newUser.role}
//               onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//               className="p-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="my-2">
//             <input
//               type="password"
//               placeholder="Password"
//               value={newUser.password}
//               onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//               className="p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className={`bg-teal-500 text-white p-2 rounded-md ${loading ? 'opacity-50' : ''}`}
//             disabled={loading}
//           >
//             {loading ? 'Creating...' : 'Create User'}
//           </button>
//         </form>
//       </div>

//       {/* Users List Section */}
//       <div className="my-6">
//         <h3 className="text-2xl font-semibold text-teal-500">Users List</h3>
//         <table className="min-w-full border-collapse mt-4">
//           <thead>
//             <tr>
//               <th className="border-b px-4 py-2">Name</th>
//               <th className="border-b px-4 py-2">Email</th>
//               <th className="border-b px-4 py-2">Role</th>
//               <th className="border-b px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td className="border-b px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
//                 <td className="border-b px-4 py-2">{user.email}</td>
//                 <td className="border-b px-4 py-2">{user.role}</td>
//                 <td className="border-b px-4 py-2">
//                   <button
//                     onClick={() => handleDeactivateUser(user._id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
//                   >
//                     Deactivate
//                   </button>
//                   <button
//                     onClick={() => handleChangeUserRole(user._id, 'claims-approver')}
//                     className="bg-teal-500 text-white px-2 py-1 rounded-md"
//                   >
//                     Change Role to Claims Approver
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Activity Log Section */}
//       <div className="my-6">
//         <h3 className="text-2xl font-semibold text-teal-500">User Activity Logs</h3>
//         <table className="min-w-full border-collapse mt-4">
//           <thead>
//             <tr>
//               <th className="border-b px-4 py-2">User</th>
//               <th className="border-b px-4 py-2">Action</th>
//               <th className="border-b px-4 py-2">Timestamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activityLogs.map((log) => (
//               <tr key={log._id}>
//                 <td className="border-b px-4 py-2">{log.user.firstName} {log.user.lastName}</td>
//                 <td className="border-b px-4 py-2">{log.action}</td>
//                 <td className="border-b px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles] = useState(['admin', 'claims-approver', 'auditor']);
  const [activityLogs, setActivityLogs] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchUsers();
    fetchActivityLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await axiosInstance.get('/users/activity-log');
      setActivityLogs(response.data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      console.log('User created successfully', response.data);
      fetchUsers(); // Refresh the users list after creating a user
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/deactivate`);
      alert(response.data.message);
      fetchUsers(); // Refresh users list after deactivation
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/role`, { role: newRole });
      alert(response.data.message);
      fetchUsers(); // Refresh the users list after role update
    } catch (error) {
      console.error('Error changing user role:', error);
      alert('Error changing user role');
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const userData = { ...newUser };
    handleCreateUser(userData);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-teal-600">User Management</h2>

      {/* Create User Section */}
      <div className="my-4">
        <h3 className="text-2xl font-semibold text-teal-500">Create New User</h3>
        <form onSubmit={onSubmit}>
          <div className="my-2">
            <input
              type="text"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="my-2">
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="my-2">
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="my-2">
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="my-2">
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-teal-500 text-white p-2 rounded-md ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {/* Users List Section */}
      <div className="my-6">
        <h3 className="text-2xl font-semibold text-teal-500">Users List</h3>
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">Email</th>
              <th className="border-b px-4 py-2">Role</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border-b px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                <td className="border-b px-4 py-2">{user.email}</td>
                <td className="border-b px-4 py-2">{user.role}</td>
                <td className="border-b px-4 py-2">
                  <button
                    onClick={() => handleDeactivateUser(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleChangeUserRole(user._id, 'claims-approver')}
                    className="bg-teal-500 text-white px-2 py-1 rounded-md"
                  >
                    Change Role to Claims Approver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Log Section */}
      <div className="my-6">
        <h3 className="text-2xl font-semibold text-teal-500">User Activity Logs</h3>
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">User</th>
              <th className="border-b px-4 py-2">Action</th>
              <th className="border-b px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log) => (
              <tr key={log._id}>
                <td className="border-b px-4 py-2">{`${log.user.firstName} ${log.user.lastName}`}</td>
                <td className="border-b px-4 py-2">{log.action}</td>
                <td className="border-b px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
