// components/DoctorPages/ManageUsers.js
import React, { useState, useEffect } from 'react';

function ManageUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch the list of users (dummy data or API call)
        setUsers([
            { id: 1, name: 'John Doe', role: 'Patient' },
            { id: 2, name: 'Jane Smith', role: 'Doctor' }
        ]);
    }, []);

    return (
        <div>
            <h2>Manage Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <h3>{user.name}</h3>
                        <p>Role: {user.role}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageUsers;
