import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

function TestComponent() {
    const [subject, setSubject] = useState('');
    const [action, setAction] = useState('');
    const [resource, setResource] = useState('');
    const [response, setResponse] = useState(null);
    const { userProfile } = useUser();

    const handleEvaluateRequest = async () => {
        try {
            const result = await axios.post(
                'https://localhost:3000/xacml/evaluate', 
                {
                    subject: subject,
                    action: action,
                    resource: resource
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${userProfile.username}`,  // Pass the username in the header
                    },
                    withCredentials: true // Optional, if you need credentials
                }
            );

            setResponse({
                status: result.data,
                message: result.data.message || 'Policy evaluation completed.'
            });
        } catch (error) {
            setResponse({
                status: 'Error',
                message: error.response?.data || 'Failed to evaluate policy.'
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">RBAC Policy Tester</h1>
            <div className="border border-[#5c5470] p-4 rounded-lg mb-4 bg-[#202124]">
                <div className="flex flex-col">
                    <div className='flex items-center justify-between'>
                        <label className="text-md font-bold text-zinc-50">Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-11/12 p-2 rounded bg-[#292a2d] text-zinc-50 outline-none"
                        />
                    </div>
                    <div className='flex items-center justify-between mt-4'>
                        <label className="text-md font-bold text-zinc-50">Action:</label>
                        <input
                            type="text"
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="w-11/12 p-2 rounded bg-[#292a2d] text-zinc-50 outline-none"
                        />
                    </div>
                    <div className='flex items-center justify-between mt-4'>
                        <label className="text-md font-bold text-zinc-50">Resource:</label>
                        <input
                            type="text"
                            value={resource}
                            onChange={(e) => setResource(e.target.value)}
                            className="w-11/12 p-2 rounded bg-[#292a2d] text-zinc-50 outline-none"
                        />
                    </div>
                    <button
                        onClick={handleEvaluateRequest}
                        className="w-full mt-8 bg-[#292a2d] text-zinc-50 py-2 px-4 rounded hover:brightness-105"
                    >
                        Evaluate request
                    </button>
                </div>
            </div>

            {response && (
                <div className={`border p-4 rounded-lg ${response.status === 'Permit' ? 'border-green-500' : 'border-red-500'} bg-[#202124]`}>
                    <p><strong>Decision:</strong> {response.status}</p>
                    <p><strong>Message:</strong> {response.message}</p>
                </div>
            )}
        </div>
    );
}

export default TestComponent;
