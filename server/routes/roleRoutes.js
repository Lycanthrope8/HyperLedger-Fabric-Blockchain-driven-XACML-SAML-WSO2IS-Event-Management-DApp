const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// Route to get all roles (assuming 'read' action and 'roles' resource)
router.get('/', authorizationMiddleware('read', 'roles'), roleController.getAllRoles);

// Route to get a specific role by ID (assuming 'read' action and 'role' resource)
router.get('/:id', authorizationMiddleware('read', 'roles'), roleController.getRoleById);

// Route to create a new role (assuming 'create' action and 'role' resource)
router.post('/', authorizationMiddleware('write', 'roles'), roleController.createRole);

// Route to update an existing role (assuming 'update' action and 'role' resource)
router.put('/:id', authorizationMiddleware('update', 'roles'), roleController.updateRole);

// Route to delete a role (assuming 'delete' action and 'role' resource)
router.delete('/:id', authorizationMiddleware('delete', 'roles'), roleController.deleteRole);

module.exports = router;
