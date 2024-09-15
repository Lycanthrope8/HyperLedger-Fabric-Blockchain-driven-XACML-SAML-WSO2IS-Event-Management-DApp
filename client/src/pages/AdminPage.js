import React, { useState } from 'react';
import { FiUsers, FiTool, FiArchive, FiBookOpen, FiCheckSquare, FiLogOut, FiHome } from 'react-icons/fi';
import { MdRule } from 'react-icons/md';

import UserComponent from '../components/UsersComponent';
import RolesComponent from '../components/RolesComponent';
import TestComponent from '../components/TestComponent';
import PolicyComponent from '../components/PolicyComponent';

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
            case 'Policy':
                return <PolicyComponent />;
            default:
                return <p>Welcome Home</p>;
        }
    };

    return (
        <div className="flex min-h-screen text-white">
            <div className="w-64 p-5 bg-[#35166e]">
                <h1 className="text-lg pl-2 font-bold text-zinc-50 mb-10">ADMIN PANEL</h1>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Users')}><FiUsers /> Users</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Roles')}><FiTool /> Roles</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Actions')}><FiArchive /> Actions</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Resources')}><FiBookOpen /> Resources</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Rules')}><MdRule /> Rules</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Test')}><FiCheckSquare /> Test</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Policy')}><FiLogOut /> Policy</li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#6834d4] rounded cursor-pointer" onClick={() => setActiveTab('Home')}><FiHome /> Go back Home</li>
                </ul>
            </div>
            <div className="flex-grow p-10">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminPage;
