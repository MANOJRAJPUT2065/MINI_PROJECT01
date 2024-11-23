import React, { useState, useEffect } from 'react';

function ManagePolicies() {
    const [policies, setPolicies] = useState([]);
    const [newPolicy, setNewPolicy] = useState({ name: '', details: '' });
    const [error, setError] = useState('');

    // Simulate fetching policies from an API
    useEffect(() => {
        const fetchPolicies = async () => {
            // Simulated data; replace with actual API call
            setPolicies([
                { id: 1, name: 'Policy A', details: 'Details about Policy A' },
                { id: 2, name: 'Policy B', details: 'Details about Policy B' }
            ]);
        };
        fetchPolicies();
    }, []);

    // Add a new policy
    const addPolicy = () => {
        if (!newPolicy.name || !newPolicy.details) {
            setError('Both fields are required');
            return;
        }
        setError('');
        const id = policies.length + 1; // Generate a new ID
        const updatedPolicies = [...policies, { id, ...newPolicy }];
        setPolicies(updatedPolicies);
        setNewPolicy({ name: '', details: '' }); // Clear the form
    };

    // Delete a policy with confirmation
    const deletePolicy = (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            const updatedPolicies = policies.filter(policy => policy.id !== id);
            setPolicies(updatedPolicies);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Policies</h2>
            
            {/* Form for adding new policies */}
            <div className="mb-8">
                <h3 className="text-xl mb-2">Add New Policy</h3>
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Policy Name"
                            value={newPolicy.name}
                            onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Policy Details"
                            value={newPolicy.details}
                            onChange={(e) => setNewPolicy({ ...newPolicy, details: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        ></textarea>
                    </div>
                    <div>
                        <button
                            onClick={addPolicy}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                            disabled={!newPolicy.name || !newPolicy.details}
                        >
                            Add Policy
                        </button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>

            {/* Display list of policies */}
            <div>
                <h3 className="text-xl mb-2">Existing Policies</h3>
                <ul className="space-y-4">
                    {policies.map(policy => (
                        <li key={policy.id} className="border p-4 rounded-md shadow-md">
                            <h4 className="text-lg font-semibold">{policy.name}</h4>
                            <p>{policy.details}</p>
                            <button
                                onClick={() => deletePolicy(policy.id)}
                                className="mt-2 text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ManagePolicies;
