import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TbEdit, TbTrash } from "react-icons/tb";
import Select from 'react-select';
import { useUser } from "../contexts/UserContext";
import useAuthorization from '../hooks/useAuthorization';
import ConfirmModalComponent from './confirmModalComponent';
import { Bouncy } from 'ldrs';

function UserComponent() {
    const [users, setUsers] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [originalRoles, setOriginalRoles] = useState([]); // Store original roles before editing
    const [newRole, setNewRole] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [userToModify, setUserToModify] = useState(null);
    const [isLoadingSave, setIsLoadingSave] = useState(false); // Loading state for save
    const [isLoadingDelete, setIsLoadingDelete] = useState(false); // Loading state for delete
    const [roleToRemove, setRoleToRemove] = useState(null); // Role to be removed

    const { userProfile } = useUser();
    const { isAuthorized: canDelete, loading: loadingDelete } = useAuthorization(userProfile?.username, 'delete', 'roles');
    const { isAuthorized: canSave, loading: loadingSave } = useAuthorization(userProfile?.username, 'update', 'roles');

    useEffect(() => {
        const fetchUsersAndRoles = async () => {
            try {
                const usersResponse = await axios.get('https://localhost:3000/xacml/getAllUsers', {
                    headers: {
                        'Authorization': `Bearer ${userProfile?.username}`,
                    },
                    withCredentials: true, // Include credentials if necessary
                });

                if (Array.isArray(usersResponse.data)) {
                    setUsers(usersResponse.data);
                }

                const rolesResponse = await axios.get('https://localhost:3000/roles', {
                    headers: {
                        'Authorization': `Bearer ${userProfile?.username}`,
                    },
                    withCredentials: true,
                });

                if (Array.isArray(rolesResponse.data)) {
                    setRolesOptions(rolesResponse.data.map(role => ({ value: role.name, label: role.name })));
                }
            } catch (error) {
                console.error('Failed to fetch users or roles:', error);
            }
        };
        if (userProfile?.username) {
            fetchUsersAndRoles();
        }
    }, [userProfile]);

    const handleEdit = (user) => {
        setEditUser(user);
        const userRoles = user.role ? user.role.map(r => ({ value: r, label: r })) : [];
        setSelectedRoles(userRoles);
        setOriginalRoles(userRoles); // Save original roles for comparison later
    };

    const handleSave = () => {
        setModalAction('save');
        setShowModal(true);
    };

    const confirmSave = async () => {
        setIsLoadingSave(true); // Start loading
        setShowModal(false);
        try {
            // Prepare arrays of role names from selectedRoles and originalRoles
            const selectedRoleValues = selectedRoles.map(option => option.value);
            const originalRoleValues = originalRoles.map(option => option.value);

            // Determine which roles need to be added
            const rolesToAdd = selectedRoleValues.filter(role => !originalRoleValues.includes(role));
            // Determine which roles need to be removed
            const rolesToRemove = originalRoleValues.filter(role => !selectedRoleValues.includes(role));

            // API call to add new roles
            for (const role of rolesToAdd) {
                const response = await axios.post('https://localhost:3000/xacml/setRole', {
                    username: editUser.username,
                    roles: role,
                }, {
                    headers: {
                        'Authorization': `Bearer ${userProfile.username}`,
                    },
                    withCredentials: true, // Include credentials if necessary
                });

                if (response.status !== 200) {
                    throw new Error(`Failed to add role: ${role}`);
                }
            }

            // API call to remove roles
            for (const role of rolesToRemove) {
                const response = await axios.post('https://localhost:3000/xacml/removeRole', {
                    username: editUser.username,
                    role: role,
                }, {
                    headers: {
                        'Authorization': `Bearer ${userProfile.username}`,
                    },
                    withCredentials: true, // Include credentials if necessary
                });

                if (response.status !== 200) {
                    throw new Error(`Failed to remove role: ${role}`);
                }
            }

            // Update the user list locally
            const updatedUsers = users.map(user =>
                user.username === editUser.username ? { ...user, role: selectedRoleValues } : user
            );
            setUsers(updatedUsers);

            // Reset after saving
            setEditUser(null);
            setSelectedRoles([]);
            setOriginalRoles([]);
        } catch (error) {
            console.error('Failed to update user roles:', error);
        } finally {
            setIsLoadingSave(false); // End loading
        }
    };

    const handleDelete = (username) => {
        setUserToModify(username);
        setModalAction('delete');
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setIsLoadingDelete(true); // Start loading
        setShowModal(false);
        try {
            await axios.delete(`https://localhost:3000/xacml/deleteUser/${userToModify}`, {
                headers: {
                    'Authorization': `Bearer ${userProfile.username}`,
                },
                withCredentials: true, // Include credentials if necessary
            });
            setUsers(users.filter(user => user.username !== userToModify));
        } catch (error) {
            console.error('Failed to delete user:', error.message);
        } finally {
            setIsLoadingDelete(false); // End loading
        }
    };

    const handleRemoveRoleFromEdit = (roleToRemove) => {
        setSelectedRoles(prevRoles => prevRoles.filter(role => role.value !== roleToRemove));
    };

    const handleAddNewRole = () => {
        if (newRole.trim()) {
            const newRoleOption = { value: newRole.trim(), label: newRole.trim() };
            if (!selectedRoles.find(role => role.value === newRole.trim())) {
                setSelectedRoles([...selectedRoles, newRoleOption]);
            }
            setNewRole('');
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#202124',
            borderColor: '#444444',
            color: '#f0f0f0',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#202124' : state.isFocused ? '#3a3a3a' : '#5c5470',
            color: '#f0f0f0',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#202124',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#444444',
            color: '#f0f0f0',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#f0f0f0',
        }),
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">User Management</h1>
            <div className="bg-[#202124] p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-3 text-zinc-50">Current Users</h2>
                <table className="min-w-full text-zinc-50 border-zinc-400">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Roles</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index} className='border border-zinc-500'>
                                    <td className="border-r border-zinc-500 px-4 py-2">{user.username || 'Unknown'}</td>
                                    <td className="border-r border-zinc-500 px-4 py-2">
                                        {user.role ? user.role.map(r => (
                                            <span key={r} className="inline-block mr-2 bg-[#292a2d] px-2 py-1 rounded text-white">
                                                {r}
                                            </span>
                                        )) : 'No role'}
                                    </td>
                                    <td className="px-4 py-2 flex justify-evenly">
                                        <button className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded hover:brightness-105" onClick={() => handleEdit(user)}>
                                            <TbEdit className="text-2xl" />
                                        </button>

                                        {!loadingDelete && canDelete && (
                                            <button className="bg-[#6d2b2b] text-zinc-50 py-1 px-3 rounded hover:brightness-105 ml-2" onClick={() => handleDelete(user.username)}>
                                                <TbTrash className="text-2xl" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editUser && (
                <div className="p-4 bg-[#202124] rounded-lg mt-4">
                    <h2 className="text-lg font-bold mb-3 text-zinc-50">Edit User Roles</h2>
                    <Select
                        isMulti
                        options={rolesOptions}
                        value={selectedRoles}
                        onChange={setSelectedRoles}
                        styles={customStyles}
                        className="text-zinc-50"
                    />

                    {/* <div className="flex mt-4">
                        <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="Enter a new role"
                            className="bg-[#292a2d] text-zinc-50 px-3 py-2 rounded-md mr-2"
                        />
                        <button onClick={handleAddNewRole} className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded hover:brightness-105">
                            Add Role
                        </button>
                    </div> */}

                    {!loadingSave && canSave && (
                        <button className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded hover:brightness-105 mt-4" onClick={handleSave}>
                            Save
                        </button>
                    )}
                    <button className="bg-[#6d2b2b] text-zinc-50 py-1 px-3 rounded hover:brightness-105 ml-2 mt-4" onClick={() => setEditUser(null)}>
                        Cancel
                    </button>
                </div>
            )}

            {showModal && (
                <ConfirmModalComponent
                    title={modalAction === 'delete' ? 'Confirm Delete' : 'Confirm Save'}
                    message={modalAction === 'delete' ? 'Are you sure you want to delete this user?' : 'Do you want to save the changes?'}
                    onConfirm={modalAction === 'delete' ? confirmDelete : confirmSave}
                    onCancel={() => setShowModal(false)}
                    confirmText={modalAction === 'delete' ? 'Delete' : 'Save'}
                    cancelText="Cancel"
                />
            )}

            {(isLoadingSave || isLoadingDelete) && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <l-bouncy
                        size="45"
                        speed="1.75"
                        color="white"
                    ></l-bouncy>
                </div>
            )}
        </div>
    );
}

export default UserComponent;
