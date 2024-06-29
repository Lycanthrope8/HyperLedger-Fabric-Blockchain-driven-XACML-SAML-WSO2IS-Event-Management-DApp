'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const samlConfig = require('../config/saml-config');

let userProfile;

// Configure SAML Strategy for Passport
const strategy = new SamlStrategy(samlConfig, (profile, done) => {
    userProfile = profile;
    console.log('SAML Profile:', profile);  // Log the SAML profile
    done(null, userProfile);
});

passport.use(strategy);

const redirectToLogin = (req, res, next) => {
    if (!req.isAuthenticated() || userProfile == null) {
        return res.redirect('/app/login');
    }
    next();
};

// Routes

router.get('/app', redirectToLogin, (req, res) => {
    res.render('index', {
        title: 'Express Web Application',
        heading: 'Logged-In to Express Web Application'
    });
});

router.get('/app/login', passport.authenticate('saml', {
    successRedirect: '/app',
    failureRedirect: '/app/login',
    failureFlash: true
}));

router.post('/saml/consume', (req, res, next) => {
    console.log('SAML Response Body:', req.body);  // Log the SAML response
    passport.authenticate('saml', {
        failureRedirect: '/app/failed',
        failureFlash: true
    })(req, res, next);
}, (req, res) => {
    if (req.body.SAMLResponse) {
        const base64String = req.body.SAMLResponse;
        const xmlString = Buffer.from(base64String, 'base64').toString('utf-8');
        console.log('SAML XML Response:', xmlString);  // Log the SAML XML response
    }
    return res.redirect('/app');
});

router.get('/app/logout', (req, res) => {
    if (req.user == null) {
        return res.redirect('/app/home');
    }

    // Corrected logout handling
    strategy.logout(req, (err, uri) => {
        if (err) {
            console.error('Logout Error:', err);  // Log errors during logout
            return res.redirect('/app');
        }
        req.logout((err) => {  // Added callback for req.logout
            if (err) {
                console.error('Logout Error:', err);  // Log errors during logout
                return res.redirect('/app');
            }
            userProfile = null;
            return res.redirect(uri);
        });
    });
});

router.get('/app/failed', (req, res) => {
    res.status(401).send('Login failed');
});

module.exports = router;
