'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Routes
router.get('/app', authController.redirectToLogin, (req, res) => {
    res.render('index', {
        title: 'Express Web Application',
        heading: 'Logged-In to Express Web Application'
    });
});

router.get('/app/login', authController.handleLogin);

router.post('/saml/consume', authController.handleSamlConsume, authController.handleSamlConsumeRedirect);

router.get('/app/logout', authController.handleLogout);

router.get('/app/failed', authController.handleFailedLogin);

module.exports = router;
