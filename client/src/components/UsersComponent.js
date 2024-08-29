import React from 'react';

function UserComponent() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">User Management</h1>
            <div className="bg-[#2a2438] p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-3 text-zinc-50">Current Users</h2>
                <table className="min-w-full text-zinc-50">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">1</td>
                            <td className="border px-4 py-2">john.doe</td>
                            <td className="border px-4 py-2">Administrator</td>
                            <td className="border px-4 py-2">
                                <button className="bg-[#5c5470] text-zinc-50 py-1 px-3 rounded-full hover:brightness-105">Edit</button>
                                <button className="bg-red-500 text-zinc-50 py-1 px-3 rounded-full hover:brightness-105 ml-2">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserComponent;
