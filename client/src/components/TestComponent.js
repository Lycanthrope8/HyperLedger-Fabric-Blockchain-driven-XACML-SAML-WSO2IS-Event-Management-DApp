import React, { useState } from 'react';

function TestComponent() {
    const [response, setResponse] = useState(null);

    const handleEvaluateRequest = () => {
        console.log("Evaluating request...");
        setResponse({
            status: "Authorized",
            message: "Access granted to the resource."
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-zinc-50">RBAC Test</h1>
            <div className="border p-4 rounded-lg mb-4">
                <h2 className="text-lg font-bold mb-3 text-zinc-50">Request</h2>
                <div className="space-y-2">
                    <p><strong>Username:</strong> administrator</p>
                    <p><strong>Resource:</strong> TemplateCreate</p>
                    <p><strong>Action:</strong> POST</p>
                    <button onClick={handleEvaluateRequest} className="mt-4 bg-[#5c5470] text-zinc-50 py-2 px-4 rounded-full hover:brightness-105">
                        Evaluate request
                    </button>
                </div>
            </div>
            {response && (
                <div className="border p-4 rounded-lg">
                    <h2 className="text-lg font-bold text-zinc-50">Response</h2>
                    <p>{response.status}</p>
                    <p>{response.message}</p>
                </div>
            )}
        </div>
    );
}

export default TestComponent;
