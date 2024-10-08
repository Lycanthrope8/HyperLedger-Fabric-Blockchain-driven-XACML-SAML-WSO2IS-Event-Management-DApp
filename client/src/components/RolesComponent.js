import React, { useState, useEffect } from 'react';
import { TbEdit, TbTrash } from "react-icons/tb";
import axios from 'axios';

function RolesComponent() {
    const [roles, setRoles] = useState([]); // Initialize empty state for roles
    const [newRoleName, setNewRoleName] = useState(''); // State to store the new role's name
    const [newRoleDescription, setNewRoleDescription] = useState(''); // State to store the new role's description
    const [isAddingRole, setIsAddingRole] = useState(false); // State to track if adding a new role
    const [editRole, setEditRole] = useState(null); // State to track if editing a role

    // Fetch roles from the API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://localhost:3000/roles', { withCredentials: true });
                setRoles(response.data);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleEdit = (role) => {
        setEditRole(role); // Set the role to be edited
        setNewRoleName(role.name); // Pre-fill the text box with the role's name
        setNewRoleDescription(role.description); // Pre-fill the text box with the role's description
        setIsAddingRole(true); // Show the input fields
    };

    const handleUpdateRole = async () => {
        if (editRole) {
            try {
                const updatedRole = {
                    name: newRoleName,
                    description: newRoleDescription
                };
                const response = await axios.put(`https://localhost:3000/roles/${editRole._id}`, updatedRole);
                setRoles(roles.map(role => role._id === editRole._id ? response.data : role)); // Update the role in the local state
                resetForm(); // Clear the input fields and reset states
            } catch (error) {
                console.error("Failed to update role:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:3000/roles/${id}`, { withCredentials: true });
            // Remove the role from the local state
            setRoles(roles.filter(role => role._id !== id));
        } catch (error) {
            console.error("Failed to delete role:", error);
        }
    };

    const handleAddRole = async () => {
        if (newRoleName.trim() && newRoleDescription.trim()) {
            const newRole = {
                name: newRoleName,
                description: newRoleDescription,
            };
            try {
                const response = await axios.post('https://localhost:3000/roles', newRole, { withCredentials: true });
                setRoles([...roles, response.data]); // Add the new role to the local state
                resetForm(); // Clear the input fields
            } catch (error) {
                console.error("Failed to add role:", error);
            }
        } else {
            alert("Please enter a valid role name and description");
        }
    };

    const resetForm = () => {
        setNewRoleName(''); // Clear the role name input
        setNewRoleDescription(''); // Clear the role description input
        setIsAddingRole(false); // Hide the input form
        setEditRole(null); // Clear the edit state
    };

    const toggleAddRole = () => {
        resetForm(); // Reset everything when toggling the form
        setIsAddingRole(!isAddingRole); // Toggle the visibility of the input field
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">Role Management</h1>
            <div className="bg-[#202124] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-50">Roles</h2>
                    <button onClick={toggleAddRole} className="bg-[#292a2d] py-2 px-4 rounded-full text-zinc-50 hover:brightness-105">
                        {isAddingRole ? 'Cancel' : 'Add Role'}
                    </button>
                </div>
                <table className="min-w-full text-zinc-50">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length > 0 ? roles.map((role, index) => (
                            <tr key={role._id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{role.name}</td>
                                <td className="border px-4 py-2">{role.description}</td>
                                <td className="border px-4 py-2 flex justify-evenly">
                                    <button onClick={() => handleEdit(role)} className="bg-[#5c5470] py-1 px-3 rounded hover:brightness-105">
                                        <TbEdit className='text-2xl' />
                                    </button>
                                    <button onClick={() => handleDelete(role._id)} className="bg-[#6d2b2b] py-1 px-3 rounded hover:brightness-105">
                                        <TbTrash className='text-2xl' />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No roles found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Conditionally render the input field for adding/updating roles */}
            {isAddingRole && (
                <div className="mt-4 bg-[#202124] p-4 rounded-lg">
                    <h2 className="text-lg font-bold text-zinc-50 mb-3">{editRole ? 'Edit Role' : 'Add New Role'}</h2>
                    <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Enter role name"
                        className="bg-[#292a2d] py-2 px-4 rounded-full text-zinc-50 w-full mb-2"
                    />
                    <input
                        type="text"
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        placeholder="Enter role description"
                        className="bg-[#292a2d] py-2 px-4 rounded-full text-zinc-50 w-full mb-2"
                    />
                    <button
                        onClick={editRole ? handleUpdateRole : handleAddRole}
                        className="bg-[#292a2d] py-2 px-4 rounded-full text-zinc-50 hover:brightness-105"
                    >
                        {editRole ? 'Update Role' : 'Save Role'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default RolesComponent;
