import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthorization from '../hooks/useAuthorization';
import { useUser } from '../contexts/UserContext';

function PolicyTesterComponent() {
    const [policyId, setPolicyId] = useState('');
    const [policyXml, setPolicyXml] = useState('');
    const [allPolicies, setAllPolicies] = useState(null);
    const [error, setError] = useState(null);

    const { userProfile } = useUser();

    const { isAuthorized: canAddPolicy, loading: loadingAddPolicy } = useAuthorization(userProfile.username, 'write', 'policy');
    const { isAuthorized: canGetPolicies, loading: loadingGetPolicies } = useAuthorization(userProfile.username, 'read', 'policy');

    // Handle adding a policy
    const handleAddPolicySubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const res = await axios.post(
                'https://localhost:3000/xacml/addPolicy',
                { policyId, policyXml },
                {
                    headers: {
                        'Authorization': `Bearer ${userProfile.username}`,
                    },
                    withCredentials: true, // Optional, depending on if your server requires credentials
                }
            );
            toast.success('Policy added successfully!', {
                className: 'toast-success',
                bodyClassName: 'toast-body',
            });
        } catch (err) {
            setError('Failed to add policy. Please try again.');
            toast.error('Failed to add policy. Please try again.', {
                className: 'toast-error',
                bodyClassName: 'toast-body',
            });
        }
    };

    // Handle fetching all policies
    const handleGetAllPolicies = async () => {
        setError(null);
        setAllPolicies(null);

        try {
            const res = await axios.get('https://localhost:3000/xacml/getAllPolicies', {
                headers: {
                    'Authorization': `Bearer ${userProfile.username}`,
                },
                withCredentials: true, // Optional
            });
            setAllPolicies(res.data);
        } catch (err) {
            setError('Failed to fetch policies. Please try again.');
        }
    };

    return (
        <div className="p-4 bg-[#202124] rounded-lg relative">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">Policy Tester</h1>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            {!loadingAddPolicy && canAddPolicy && (
                <form onSubmit={handleAddPolicySubmit} className="mb-6">
                    <h2 className="text-lg font-bold mb-3 text-zinc-50">Add Policy</h2>
                    <div className="mb-4">
                        <label className="block text-zinc-50 text-sm font-bold mb-2" htmlFor="policyId">Policy ID</label>
                        <input
                            id="policyId"
                            name="policyId"
                            className="shadow appearance-none bg-[#292a2d] rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter the policy ID..."
                            value={policyId}
                            onChange={(e) => setPolicyId(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-zinc-50 text-sm font-bold mb-2" htmlFor="policyXmlAdd">Policy XML</label>
                        <textarea
                            id="policyXmlAdd"
                            name="policyXmlAdd"
                            className="shadow appearance-none bg-[#292a2d] rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter the policy XML to add..."
                            value={policyXml}
                            onChange={(e) => setPolicyXml(e.target.value)}
                            rows="6"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#e74b2d]/80 hover:bg-[#e74b2d]/70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Policy
                    </button>
                </form>
            )}

            {!loadingGetPolicies && canGetPolicies && (
                <div className="mb-6">
                    <button
                        onClick={handleGetAllPolicies}
                        className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Get All Policies
                    </button>
                </div>
            )}

            {allPolicies && allPolicies.length > 0 ? (
                <div className="mt-4 p-4 border border-zinc-700 rounded-lg">
                    <h2 className="text-lg font-bold mb-2 text-zinc-50">Select a Policy</h2>
                    <select
                        className="shadow appearance-none bg-[#292a2d] rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                            const selectedPolicy = allPolicies.find(policy => policy.Key === e.target.value);
                            setPolicyXml(selectedPolicy ? selectedPolicy.Record : '');
                        }}
                    >
                        <option value="">Select a policy</option>
                        {allPolicies.map((policy, index) => (
                            <option key={index} value={policy.Key}>
                                {policy.Key}
                            </option>
                        ))}
                    </select>
                </div>
            ) : allPolicies === null ? (
                <p className="text-zinc-50">No policies found.</p>
            ) : null}

            {policyXml && (
                <div className="mt-4 p-4 bg-[#292a2d] rounded-lg">
                    <h2 className="text-xl font-bold mb-2 text-zinc-300">Policy Record</h2>
                    <hr className="my-4 border-zinc-700" />
                    <pre className="text-zinc-300 whitespace-pre-wrap">{policyXml}</pre>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-200 rounded-lg">
                    <h2 className="text-lg font-bold mb-2 text-red-800">Error</h2>
                    <p className="text-red-800">{error}</p>
                </div>
            )}
        </div>
    );
}

export default PolicyTesterComponent;
