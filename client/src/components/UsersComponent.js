import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TbEdit, TbTrash } from "react-icons/tb";

function UserComponent() {
    const [users, setUsers] = useState([]); // Ensure initial state is an empty array

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://localhost:3000/xacml/getAllUsers');
                // console.log('Users:', response.data);

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Data format is incorrect. Expected an array.');
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">User Management</h1>
            <div className="bg-[#35166e] p-4 rounded-lg">
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
                                    <td className="border px-4 py-2">
                                        {user.role ? user.role.join(', ') : 'No role'}
                                    </td>
                                    <td className="border px-4 py-2 flex">
                                        <button className="bg-[#6834d4] text-zinc-50 py-1 px-3 rounded hover:brightness-105">
                                            <TbEdit className="text-2xl" />
                                        </button>
                                        <button className="bg-red-500 text-zinc-50 py-1 px-3 rounded hover:brightness-105 ml-2">
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
        </div>
    );
}

export default UserComponent;
