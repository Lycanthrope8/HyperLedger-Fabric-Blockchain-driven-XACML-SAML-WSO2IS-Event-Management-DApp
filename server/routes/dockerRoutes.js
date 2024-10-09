const express = require('express');
const router = express.Router();
const dockerController = require('../controllers/dockerController'); // Import the controller
const authorizationMiddleware = require('../middleware/authorizationMiddleware'); // Import the middleware

// Get all containers
router.get('/containers', 
    authorizationMiddleware('read', 'containers'), 
    dockerController.getAllContainers
);

// Get peer containers
router.get('/peers', 
    authorizationMiddleware('read', 'peers'), 
    dockerController.getPeerContainers
);

// Get logs of a specific container by ID
router.get('/containers/:id/logs', 
    authorizationMiddleware('read', 'logs'), 
    dockerController.getContainerLogs
);

// Stop a container by ID
router.post('/containers/:id/stop', 
    authorizationMiddleware('write', 'containers'), 
    dockerController.stopContainer
);

module.exports = router;
