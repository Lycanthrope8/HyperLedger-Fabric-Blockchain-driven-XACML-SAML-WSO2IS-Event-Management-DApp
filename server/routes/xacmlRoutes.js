const express = require('express');
const router = express.Router();
const xacmlController = require('../controllers/xacmlController');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// Apply authorization middleware and define routes

router.post('/enforce', xacmlController.enforceAccessControl);
router.post('/evaluate', authorizationMiddleware('read', 'permission'), xacmlController.evaluatePolicy);
router.post('/setRole', authorizationMiddleware('write', 'roles'), xacmlController.setRole);
router.post('/getRole', authorizationMiddleware('read', 'roles'), xacmlController.getRole);
router.post('/addPolicy', authorizationMiddleware('write', 'policies'), xacmlController.addPolicy);
router.post('/getPolicy', authorizationMiddleware('read', 'policies'), xacmlController.getPolicy);
router.get('/getAllPolicies', authorizationMiddleware('read', 'policies'), xacmlController.getAllPolicies);
router.get('/getAllUsers', authorizationMiddleware('read', 'roles'), xacmlController.getAllUsers);
router.post('/getUsersByRole', authorizationMiddleware('read', 'roles'), xacmlController.getUsersByRole);
router.post('/checkUserExists', authorizationMiddleware('read', 'roles'), xacmlController.checkUserExists);

router.delete('/deleteUser/:username', authorizationMiddleware('delete', 'roles'), xacmlController.deleteUser);
router.post('/removeRole', authorizationMiddleware('delete', 'roles'), xacmlController.removeRole);

module.exports = router;
