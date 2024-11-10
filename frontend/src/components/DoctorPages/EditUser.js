// components/DoctorPages/EditUser.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditUser() {
    const { userId } = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        // Fetch the user data based on userId (dummy data or API call)
        setUser({ id: userId, name: 'John Doe', role: 'Patient' });
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle user update logic here
        alert('User updated');
    };

    return (
        <div>
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                </div>
                <div>
                    <label>Role</label>
                    <input type="text" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} />
                </div>
                <button type="submit">Update User</button>
            </form>
        </div>
    );
}

export default EditUser;
