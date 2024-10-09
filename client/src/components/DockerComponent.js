import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';  // Assuming you have a user context for getting the user profile

const DockerComponent = () => {
    const [containers, setContainers] = useState([]);
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(false);
    const [logLoading, setLogLoading] = useState(false);  // Separate loading state for logs
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLogContainer, setCurrentLogContainer] = useState(null);

    const { userProfile } = useUser(); // Get user profile from context

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const response = await axios.get('https://localhost:3000/docker/containers', {
                    headers: {
                        'Authorization': `Bearer ${userProfile.username}`,  // Send username in header
                    },
                });
                setContainers(response.data);
            } catch (error) {
                console.error('Failed to fetch containers:', error);
            }
        };
        fetchContainers();
    }, [userProfile]);

    const fetchLogs = async (containerId) => {
        setLogLoading(true);
        try {
            const response = await axios.get(`https://localhost:3000/docker/containers/${containerId}/logs`, {
                headers: {
                    'Authorization': `Bearer ${userProfile.username}`,  // Send username in header
                },
            });
            setLogs((prevLogs) => ({ ...prevLogs, [containerId]: response.data }));
            setCurrentLogContainer(containerId);
            setModalVisible(true);
        } catch (error) {
            console.error(`Failed to fetch logs for container ${containerId}:`, error);
        } finally {
            setLogLoading(false);
        }
    };

    const stopContainer = async (containerId) => {
        setLoading(true);
        try {
            await axios.post(`https://localhost:3000/docker/containers/${containerId}/stop`, {}, {
                headers: {
                    'Authorization': `Bearer ${userProfile.username}`,  // Send username in header
                },
            });
            setContainers((prevContainers) => prevContainers.filter((container) => container.Id !== containerId));
        } catch (error) {
            console.error(`Failed to stop container ${containerId}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentLogContainer(null);
    };

    const categorizeByChaincode = (name) => {
        if (name.toLowerCase().includes('pip')) return 'PIP';
        if (name.toLowerCase().includes('pap')) return 'PAP';
        if (name.toLowerCase().includes('pdp')) return 'PDP';
        if (name.toLowerCase().includes('pep')) return 'PEP';
        return 'Others';
    };

    return (
        <div className='p-8 bg-[#202124]'>
            <h2 className='text-3xl font-bold mb-6 text-[#d1d1d1]'>Docker Management</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {containers.map((container) => (
                    <div
                        key={container.Id}
                        className='p-6 rounded-lg shadow-lg overflow-hidden bg-[#292a2d] mb-4'
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h4 className='text-lg font-semibold text-[#f8f9fa] truncate'>
                                {categorizeByChaincode(container.Names[0])}: {container.Names[0]}
                            </h4>
                            <span
                                className={`py-1 px-3 rounded text-sm font-medium ${container.State === 'running' ? 'bg-[#34a853] text-white' : 'bg-[#ea4335] text-white'}`}
                                style={{ minWidth: '80px', textAlign: 'center' }}
                            >
                                {container.Status}
                            </span>
                        </div>
                        <div className='mb-4 text-[#f8f9fa]'>
                            <strong>Image:</strong> {container.Image} <br />
                            <strong>State:</strong> {container.State}
                        </div>
                        <div className='flex gap-2'>
                            <button
                                className='bg-[#5e6ad2] text-white p-2 rounded shadow hover:bg-[#4b59ba] transition'
                                onClick={() => fetchLogs(container.Id)}
                                disabled={logLoading}
                            >
                                {logLoading ? 'Fetching Logs...' : 'View Logs'}
                            </button>
                            <button
                                className='bg-[#ea4335] text-white p-2 rounded shadow hover:bg-[#d93025] transition'
                                onClick={() => stopContainer(container.Id)}
                                disabled={loading}
                            >
                                {loading ? 'Stopping...' : 'Stop'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-[#292a2d] p-6 rounded-lg w-full md:w-4/6 lg:w-1/2">
                        <h4 className='text-lg font-bold mb-2 text-[#f8f9fa]'>Logs for {containers.find(container => container.Id === currentLogContainer)?.Names[0]}</h4>
                        <pre className='bg-[#202124] text-[#e8eaed] p-3 rounded max-h-[36rem] overflow-y-auto'>
                            {logs[currentLogContainer]}
                        </pre>
                        <button
                            className='mt-4 bg-[#ea4335] text-white p-2 rounded shadow hover:bg-[#d93025] transition'
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DockerComponent;
