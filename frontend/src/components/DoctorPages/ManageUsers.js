import React, { useState, useEffect } from 'react';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For now, use static data or mock data
        setUsers([
            { id: 1, name: "John Doe", role: "Patient", status: "Active" },
            { id: 2, name: "Jane Smith", role: "Doctor", status: "Inactive" },
        ]);
        setLoading(false);
    }, []);

    const handleUserAction = (userId, action) => {
        console.log(`User ID: ${userId} Action: ${action}`);
        // Implement actual user update/delete logic here
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-teal-100">
                            <th className="p-2 border-b">User Name</th>
                            <th className="p-2 border-b">Role</th>
                            <th className="p-2 border-b">Status</th>
                            <th className="p-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-teal-50">
                                <td className="p-2 border-b">{user.name}</td>
                                <td className="p-2 border-b">{user.role}</td>
                                <td className="p-2 border-b">{user.status}</td>
                                <td className="p-2 border-b">
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleUserAction(user.id, 'Edit')}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-danger ml-2"
                                        onClick={() => handleUserAction(user.id, 'Delete')}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManageUsers;
