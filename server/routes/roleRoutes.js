// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Route to get all roles
router.get('/', roleController.getAllRoles);

// Route to get a specific role by ID
router.get('/:id', roleController.getRoleById);

// Route to create a new role
router.post('/', roleController.createRole);

// Route to update an existing role
router.put('/:id', roleController.updateRole);

// Route to delete a role
router.delete('/:id', roleController.deleteRole);

module.exports = router;
