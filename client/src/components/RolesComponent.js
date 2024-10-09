import React, { useState, useEffect } from 'react';
import { TbEdit, TbTrash } from "react-icons/tb";
import axios from 'axios';
import useAuthorization from '../hooks/useAuthorization';
import { useUser } from "../contexts/UserContext";
import ConfirmModalComponent from './confirmModalComponent';

function RolesComponent() {
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [editRole, setEditRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const { userProfile } = useUser();
    const { isAuthorized: canCreate, loading: loadingCreate } = useAuthorization(userProfile.username, 'write', 'roles');
    const { isAuthorized: canUpdate, loading: loadingUpdate } = useAuthorization(userProfile.username, 'update', 'roles');
    const { isAuthorized: canDelete, loading: loadingDelete } = useAuthorization(userProfile.username, 'delete', 'roles');

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
        setEditRole(role);
        setNewRoleName(role.name);
        setNewRoleDescription(role.description);
        setIsAddingRole(true);
    };

    const handleUpdateRole = () => {
        setShowUpdateModal(true);
    };

    const confirmUpdate = async () => {
        if (editRole) {
            try {
                const updatedRole = {
                    name: newRoleName,
                    description: newRoleDescription
                };
                const response = await axios.put(`https://localhost:3000/roles/${editRole._id}`, updatedRole);
                setRoles(roles.map(role => role._id === editRole._id ? response.data : role));
                resetForm();
                setShowUpdateModal(false);
            } catch (error) {
                console.error("Failed to update role:", error);
            }
        }
    };

    const handleDelete = (id) => {
        setRoleToDelete(id);
        setModalAction('delete');
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (roleToDelete) {
            try {
                await axios.delete(`https://localhost:3000/roles/${roleToDelete}`, { withCredentials: true });
                setRoles(roles.filter(role => role._id !== roleToDelete));
                setShowModal(false);
            } catch (error) {
                console.error("Failed to delete role:", error);
            }
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
                setRoles([...roles, response.data]);
                resetForm();
            } catch (error) {
                console.error("Failed to add role:", error);
            }
        } else {
            alert("Please enter a valid role name and description");
        }
    };

    const resetForm = () => {
        setNewRoleName('');
        setNewRoleDescription('');
        setIsAddingRole(false);
        setEditRole(null);
    };

    const toggleAddRole = () => {
        resetForm();
        setIsAddingRole(!isAddingRole);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">Role Management</h1>
            <div className="bg-[#202124] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-50">Roles</h2>
                    {!loadingCreate && canCreate && (
                        <button onClick={toggleAddRole} className={`${isAddingRole ? 'bg-[#6d2b2b]' : 'bg-[#292a2d]'} py-2 px-4 rounded-lg text-zinc-50 hover:brightness-105`}>
                            {isAddingRole ? 'Cancel' : 'Add Role'}
                        </button>
                    )}
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
                            <tr key={role._id} className='border border-zinc-500'>
                                <td className="border-r border-zinc-500 px-4 py-2">{index + 1}</td>
                                <td className="border-r border-zinc-500 px-4 py-2">{role.name}</td>
                                <td className="border-r border-zinc-500 px-4 py-2">{role.description}</td>
                                <td className="px-4 py-2 flex justify-evenly">
                                    {!loadingUpdate && canUpdate && (
                                        <button onClick={() => handleEdit(role)} className="bg-[#5c5470] py-1 px-3 rounded hover:brightness-105">
                                            <TbEdit className='text-2xl' />
                                        </button>
                                    )}
                                    {!loadingDelete && canDelete && (
                                        <button onClick={() => handleDelete(role._id)} className="bg-[#6d2b2b] py-1 px-3 rounded hover:brightness-105">
                                            <TbTrash className='text-2xl' />
                                        </button>
                                    )}
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

            {isAddingRole && (
                <div className="mt-4 bg-[#202124] p-4 rounded-lg">
                    <h2 className="text-lg font-bold text-zinc-50 mb-3">{editRole ? 'Edit Role' : 'Add New Role'}</h2>
                    <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="Enter role name"
                        className="bg-[#292a2d] py-2 px-4 rounded-lg text-zinc-50 w-full mb-2"
                    />
                    <input
                        type="text"
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        placeholder="Enter role description"
                        className="bg-[#292a2d] py-2 px-4 rounded-lg text-zinc-50 w-full mb-2"
                    />
                    {!loadingCreate && canCreate && (
                        <button
                            onClick={editRole ? handleUpdateRole : handleAddRole}
                            className="bg-[#292a2d] py-2 px-4 rounded-lg text-zinc-50 hover:brightness-105"
                        >
                            {editRole ? 'Update Role' : 'Save Role'}
                        </button>
                    )}
                </div>
            )}

            {showModal && (
                <ConfirmModalComponent
                    title="Confirm Delete"
                    message="Are you sure you want to delete this role?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowModal(false)}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}

            {showUpdateModal && (
                <ConfirmModalComponent
                    title="Confirm Update"
                    message="Are you sure you want to update this role?"
                    onConfirm={confirmUpdate}
                    onCancel={() => setShowUpdateModal(false)}
                    confirmText="Update"
                    cancelText="Cancel"
                />
            )}
        </div>
    );
}

export default RolesComponent;
