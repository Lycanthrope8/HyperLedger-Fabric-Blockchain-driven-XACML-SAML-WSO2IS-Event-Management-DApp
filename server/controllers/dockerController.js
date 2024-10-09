const Docker = require('dockerode');
const docker = new Docker();

// Controller for getting all containers
exports.getAllContainers = async (req, res) => {
    try {
        const containers = await docker.listContainers();
        res.json(containers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for getting peer containers
exports.getPeerContainers = async (req, res) => {
    try {
        const containers = await docker.listContainers({
            filters: { name: ['peer'] }
        });
        res.json(containers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for getting logs of a specific container by ID
exports.getContainerLogs = async (req, res) => {
    const containerId = req.params.id;
    try {
        const container = docker.getContainer(containerId);
        const logs = await container.logs({
            stdout: true,
            stderr: true,
            follow: false,
            tail: 100
        });
        res.json(logs.toString());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

// Controller for stopping a container by ID
exports.stopContainer = async (req, res) => {
    const containerId = req.params.id;
    try {
        const container = docker.getContainer(containerId);
        await container.stop();
        res.json({ message: `Container ${containerId} stopped successfully` });
    } catch (error) {
        res.status(500).json({ error: `Failed to stop container ${containerId}` });
    }
};
