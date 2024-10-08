import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TbEdit, TbTrash } from "react-icons/tb";
import Select from 'react-select';

function UserComponent() {
    const [users, setUsers] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [newRole, setNewRole] = useState(''); // State for the new role

    useEffect(() => {
        const fetchUsersAndRoles = async () => {
            try {
                const usersResponse = await axios.get('https://localhost:3000/xacml/getAllUsers');
                if (Array.isArray(usersResponse.data)) {
                    setUsers(usersResponse.data);
                }

                // const rolesResponse = await axios.get('https://localhost:3000/xacml/getAllRoles');
                // console.log(rolesResponse.data);
                // setRolesOptions(rolesResponse.data.map(role => ({ value: role, label: role })));
            } catch (error) {
                console.error('Failed to fetch users or roles:', error);
            }
        };
        fetchUsersAndRoles();
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        setSelectedRoles(user.role ? user.role.map(r => ({ value: r, label: r })) : []);
    };

    const handleSave = async () => {
        try {
            const rolesToSave = selectedRoles.map(option => option.value);
            await axios.put('https://localhost:3000/xacml/updateUserRole', {
                username: editUser.username,
                roles: rolesToSave,
            });
            setUsers(users.map(user => user.username === editUser.username ? { ...user, role: rolesToSave } : user));
            setEditUser(null);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDelete = async (username) => {
        try {
            await axios.delete(`https://localhost:3000/xacml/deleteUser/${username}`);
            setUsers(users.filter(user => user.username !== username));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleAddNewRole = () => {
        if (newRole.trim()) {
            const newRoleOption = { value: newRole.trim(), label: newRole.trim() };
            setSelectedRoles([...selectedRoles, newRoleOption]);
            setNewRole(''); // Reset the input field
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
                <table className="min-w-full text-zinc-50">
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
                                <tr key={index}>
                                    <td className="border px-4 py-2">{user.username || 'Unknown'}</td>
                                    <td className="border px-4 py-2">{user.role ? user.role.join(', ') : 'No role'}</td>
                                    <td className="border px-4 py-2 flex justify-evenly">
                                        <button className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded hover:brightness-105" onClick={() => handleEdit(user)}>
                                            <TbEdit className="text-2xl" />
                                        </button>
                                        <button className="bg-[#6d2b2b] text-zinc-50 py-1 px-3 rounded hover:brightness-105 ml-2" onClick={() => handleDelete(user.username)}>
                                            <TbTrash className="text-2xl" />
                                        </button>
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
                    <div className="flex mt-4">
                        <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="Enter a new role"
                            className="bg-[#444444] text-zinc-50 px-3 py-2 rounded-md mr-2"
                        />
                        <button onClick={handleAddNewRole} className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded hover:brightness-105">
                            Add Role
                        </button>
                    </div>
                    <button className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded hover:brightness-105 mt-4" onClick={handleSave}>
                        Save
                    </button>
                    <button className="bg-[#6d2b2b] text-zinc-50 py-1 px-3 rounded hover:brightness-105 ml-2 mt-4" onClick={() => setEditUser(null)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserComponent;
