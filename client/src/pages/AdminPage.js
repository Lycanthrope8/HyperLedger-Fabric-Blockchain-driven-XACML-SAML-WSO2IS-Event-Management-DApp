import React, { useState } from 'react';
import { FiUsers, FiTool, FiArchive, FiBookOpen, FiCheckSquare, FiLogOut, FiHome } from 'react-icons/fi';
import { MdRule } from 'react-icons/md';

import UserComponent from '../components/UsersComponent';
import RolesComponent from '../components/RolesComponent';
import TestComponent from '../components/TestComponent';

function AdminPage() {
    const [activeTab, setActiveTab] = useState('Users');

    const renderContent = () => {
        switch (activeTab) {
            case 'Users':
                return <UserComponent />;
            case 'Roles':
                return <RolesComponent />;
            case 'Actions':
                return <p>Actions Content</p>;
            case 'Resources':
                return <p>Resources Content</p>;
            case 'Rules':
                return <p>Rules Content</p>;
            case 'Test':
                return <TestComponent />;
            case 'Logs':
                return <p>Logs Content</p>;
            default:
                return <p>Welcome Home</p>;
        }
    };

    return (
        <div className="flex h-screen bg-[#2a2438] text-white">
            <div className="w-64 p-5 bg-[#1f1d2b]"> {/* Sidebar */}
                <h1 className="text-lg font-bold text-green-300 mb-10">ADMIN PANEL</h1>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Users')}><FiUsers /> Users</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Roles')}><FiTool /> Roles</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Actions')}><FiArchive /> Actions</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Resources')}><FiBookOpen /> Resources</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Rules')}><MdRule /> Rules</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Test')}><FiCheckSquare /> Test</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Logs')}><FiLogOut /> Logs</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-green-600 rounded cursor-pointer" onClick={() => setActiveTab('Home')}><FiHome /> Go back Home</li>
                </ul>
            </div>
            <div className="flex-grow p-10"> {/* Content Area */}
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminPage;
