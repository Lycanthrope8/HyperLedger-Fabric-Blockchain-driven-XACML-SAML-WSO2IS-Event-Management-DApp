'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.get('/app', authController.redirectToLogin, (req, res) => {
    res.json({ message: 'Logged in' });
});

router.get('/app/login', authController.handleLogin);

router.post('/saml/consume', authController.handleSamlConsume, authController.handleSamlConsumeRedirect);

router.get('/app/logout', authController.handleLogout);

router.get('/app/failed', authController.handleFailedLogin);

router.get('/app/status', authController.checkAuthStatus);

module.exports = router;
