import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DockerComponent = () => {
    const [containers, setContainers] = useState([]);
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(false);
    const [showLogs, setShowLogs] = useState({});

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const response = await axios.get('https://localhost:3000/docker/containers');
                setContainers(response.data);
            } catch (error) {
                console.error('Failed to fetch containers:', error);
            }
        };
        fetchContainers();
    }, []);

    const fetchLogs = async (containerId) => {
        if (showLogs[containerId]) {
            setShowLogs((prev) => ({ ...prev, [containerId]: false }));
            return;
        }

        try {
            const response = await axios.get(`https://localhost:3000/docker/containers/${containerId}/logs`);
            setLogs((prevLogs) => ({ ...prevLogs, [containerId]: response.data }));
            setShowLogs((prev) => ({ ...prev, [containerId]: true }));
        } catch (error) {
            console.error(`Failed to fetch logs for container ${containerId}:`, error);
        }
    };

    const stopContainer = async (containerId) => {
        setLoading(true);
        try {
            await axios.post(`https://localhost:3000/docker/containers/${containerId}/stop`);
            setContainers((prevContainers) => prevContainers.filter((container) => container.Id !== containerId));
        } catch (error) {
            console.error(`Failed to stop container ${containerId}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const isPeerContainer = (name) => name.includes('peer');

    return (
        <div className='p-8 bg-[#202124]'>
            <h2 className='text-3xl font-bold mb-6 text-[#d1d1d1]'>Docker Management</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6' >
                {
                    containers.map((container) => (
                        <div
                            key={container.Id}
                            className={`p-6 rounded-lg shadow-lg overflow-hidden ${isPeerContainer(container.Names[0]) ? 'bg-[#3c4043]' : 'bg-[#292a2d]'
                                }`}
                        >
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='text-xl font-semibold text-[#f8f9fa] truncate'>
                                    {isPeerContainer(container.Names[0]) ? 'Peer Container' : 'Container'}: {container.Names[0]}
                                </h3>
                                <span
                                    className={`py-1 px-3 rounded text-sm font-medium ${container.State === 'running' ? 'bg-[#34a853] text-white' : 'bg-[#ea4335] text-white'
                                        }`}
                                    style={{ minWidth: '80px', textAlign: 'center' }} // Fixed size for uptime indicator
                                >
                                    {container.Status}
                                </span>
                            </div>
                            <div className='mb-4 text-[#f8f9fa]'>
                                <strong>ID:</strong> {container.Id.slice(0, 12)} <br />
                                <strong>Image:</strong> {container.Image} <br />
                                <strong>State:</strong> {container.State}
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    className='bg-[#5e6ad2] text-white p-2 rounded shadow hover:bg-[#4b59ba] transition'
                                    onClick={() => fetchLogs(container.Id)}
                                >
                                    {showLogs[container.Id] ? 'Hide Logs' : 'View Logs'}
                                </button>
                                <button
                                    className='bg-[#ea4335] text-white p-2 rounded shadow hover:bg-[#d93025] transition'
                                    onClick={() => stopContainer(container.Id)}
                                    disabled={loading}
                                >
                                    Stop
                                </button>
                            </div>
                            {showLogs[container.Id] && (
                                <div className='mt-4 p-4 bg-[#202124] rounded-lg'>
                                    <h4 className='text-lg font-bold mb-2 text-[#f8f9fa]'>Logs for {container.Names[0]}</h4>
                                    <pre className='bg-[#292a2d] text-[#e8eaed] p-3 rounded max-h-64 overflow-y-auto'>
                                        {logs[container.Id]}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))
                }
            </ div>
        </div >
    );
};

export default DockerComponent;
