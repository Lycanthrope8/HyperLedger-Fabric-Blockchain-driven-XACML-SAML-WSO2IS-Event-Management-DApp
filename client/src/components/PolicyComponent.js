import React, { useState } from 'react';
import axios from 'axios';
import useAuthorization from '../hooks/useAuthorization'; // Import useAuthorization hook
import { useUser } from '../contexts/UserContext'; // Assuming you have user context

function PolicyTesterComponent() {
    const [policyId, setPolicyId] = useState('');
    const [policyXml, setPolicyXml] = useState('');
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [addPolicyResult, setAddPolicyResult] = useState(null);
    const [allPolicies, setAllPolicies] = useState(null);
    const [error, setError] = useState(null);

    const { userProfile } = useUser(); // Fetch user profile from the context

    // Authorization hooks for adding and getting policies
    const { isAuthorized: canAddPolicy, loading: loadingAddPolicy } = useAuthorization(userProfile.username, 'write', 'policy');
    const { isAuthorized: canGetPolicies, loading: loadingGetPolicies } = useAuthorization(userProfile.username, 'read', 'policy');

    const handleAddPolicySubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setAddPolicyResult(null);

        try {
            const res = await axios.post('https://localhost:3000/xacml/addPolicy', { policyId, policyXml });
            setAddPolicyResult(res.data);
        } catch (err) {
            setError('Failed to add policy. Please try again.');
        }
    };

    const handleGetAllPolicies = async () => {
        setError(null);
        setAllPolicies(null);

        try {
            const res = await axios.get('https://localhost:3000/xacml/getAllPolicies');
            setAllPolicies(res.data);
        } catch (err) {
            setError('Failed to fetch policies. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">Policy Tester</h1>

            {!loadingAddPolicy && canAddPolicy && (
                <form onSubmit={handleAddPolicySubmit} className="mb-6">
                    <h2 className="text-lg font-bold mb-3 text-zinc-50">Add Policy</h2>
                    <div className="mb-4">
                        <label className="block text-zinc-50 text-sm font-bold mb-2" htmlFor="policyId">Policy ID</label>
                        <input
                            id="policyId"
                            name="policyId"
                            className="shadow appearance-none bg-[#5c5470] rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow appearance-none bg-[#5c5470] rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter the policy XML to add..."
                            value={policyXml}
                            onChange={(e) => setPolicyXml(e.target.value)}
                            rows="6"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Policy
                    </button>
                </form>
            )}

            {!loadingGetPolicies && canGetPolicies && (
                <div className="mb-6">
                    <button
                        onClick={handleGetAllPolicies}
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Get All Policies
                    </button>
                </div>
            )}

            {allPolicies && (
                <div className="mt-4 p-4 border rounded-lg">
                    <h2 className="text-lg font-bold mb-2 text-zinc-50">Select a Policy</h2>
                    <select
                        className="shadow appearance-none bg-[#5c5470] rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
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
            )}

            {policyXml && (
                <div className="mt-4 p-4 bg-[#35166e] rounded-lg">
                    <h2 className="text-lg font-bold mb-2 text-zinc-50">Policy Record</h2>
                    <pre className="text-zinc-50 whitespace-pre-wrap">{policyXml}</pre>
                </div>
            )}

            {evaluationResult && (
                <div className="mt-4 p-4 bg-green-200 rounded-lg">
                    <h2 className="text-lg font-bold mb-2 text-green-800">Evaluation Result</h2>
                    <pre className="text-green-800 whitespace-pre-wrap">{JSON.stringify(evaluationResult, null, 2)}</pre>
                </div>
            )}

            {addPolicyResult && (
                <div className="mt-4 p-4 bg-blue-200 rounded-lg">
                    <h2 className="text-lg font-bold mb-2 text-blue-800">Add Policy Result</h2>
                    <p className="text-blue-800">{addPolicyResult}</p>
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
