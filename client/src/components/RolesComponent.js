import React, { useState } from 'react';
import { TbEdit, TbTrash } from "react-icons/tb";

function RolesComponent() {
    const [roles, setRoles] = useState([
        { id: 1, name: 'administrator', canEdit: true, canDelete: true },
        { id: 2, name: 'user', canEdit: false, canDelete: false }
    ]);

    const handleEdit = (id) => {
        const updatedRoles = roles.map(role => {
            if (role.id === id) {
                const newName = prompt("Enter the new role name:");
                if (newName) {
                    return { ...role, name: newName };
                }
            }
            return role;
        });
        setRoles(updatedRoles);
    };

    const handleDelete = (id) => {
        console.log("Delete role with ID:", id);
        setRoles(prevRoles => prevRoles.filter(role => role.id !== id));
    };

    const handleAddRole = () => {
        console.log("Add new role");
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">Role Management</h1>
            <div className="bg-[#202124] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-50">Roles</h2>
                    <button onClick={handleAddRole} className="bg-[#292a2d] py-2 px-4 rounded-full text-zinc-50 hover:brightness-105">
                        Add Role
                    </button>
                </div>
                <table className="min-w-full text-zinc-50">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id}>
                                <td className="border px-4 py-2">{role.id}</td>
                                <td className="border px-4 py-2">{role.name}</td>
                                <td className="border px-4 py-2 flex justify-evenly">
                                    <button onClick={() => handleEdit(role.id)} className="bg-[#5c5470] py-1 px-3 rounded hover:brightness-105"><TbEdit className='text-2xl' /></button>
                                    <button onClick={() => handleDelete(role.id)} className="bg-[#6d2b2b] py-1 px-3 rounded hover:brightness-105"><TbTrash className='text-2xl' /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RolesComponent;
