import React, { useState } from 'react';
import { FiUsers, FiTool, FiArchive, FiBookOpen, FiCheckSquare, FiLogOut, FiHome } from 'react-icons/fi';
import { FaDocker } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import UserComponent from '../components/UsersComponent';
import RolesComponent from '../components/RolesComponent';
import TestComponent from '../components/TestComponent';
import PolicyComponent from '../components/PolicyComponent';
import DockerComponent from '../components/DockerComponent';

function AdminPage() {
    const Navigate = useNavigate();
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
            case 'Docker':
                return <DockerComponent />;
            case 'Test':
                return <TestComponent />;
            case 'Policy':
                return <PolicyComponent />;
            default:
                return <p>Welcome Home</p>;
        }
    };

    return (
        <div className="flex min-h-screen text-[#e8eaed] bg-[#202124]">
            <div className="min-w-64 p-5 bg-[#202124]">
                <h1 onClick={() => Navigate("/")} className="text-lg pl-2 font-bold text-[#f8f9fa] mb-10 cursor-pointer">
                    ADMIN PANEL
                </h1>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Users')}>
                        <FiUsers /> Users
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Roles')}>
                        <FiTool /> Roles
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Actions')}>
                        <FiArchive /> Actions
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Resources')}>
                        <FiBookOpen /> Resources
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Docker')}>
                        <FaDocker /> Docker
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Test')}>
                        <FiCheckSquare /> Test
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Policy')}>
                        <FiLogOut /> Policy
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-[#3c4043] rounded cursor-pointer" onClick={() => setActiveTab('Home')}>
                        <FiHome /> Go back Home
                    </li>
                </ul>
            </div>
            <div className="flex-grow p-10 bg-[#292a2d] rounded-lg shadow-lg">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminPage;
