const express = require('express');
const Docker = require('dockerode');
const router = express.Router();
const docker = new Docker();

router.get('/containers', async (req, res) => {
    try {
        const containers = await docker.listContainers();
        res.json(containers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/peers', async (req, res) => {
    try {
        const containers = await docker.listContainers({
            filters: { name: ['peer'] }
        });
        res.json(containers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/containers/:id/logs', async (req, res) => {
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
});


router.post('/containers/:id/stop', async (req, res) => {
    const containerId = req.params.id;
    try {
        const container = docker.getContainer(containerId);
        await container.stop();
        res.json({ message: `Container ${containerId} stopped successfully` });
    } catch (error) {
        res.status(500).json({ error: `Failed to stop container ${containerId}` });
    }
});

module.exports = router;
