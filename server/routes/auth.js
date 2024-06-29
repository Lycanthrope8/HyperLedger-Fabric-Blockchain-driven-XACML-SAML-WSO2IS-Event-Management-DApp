'use strict';

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const router = express.Router();

let userProfile;  // Moved `userProfile` to `let` for consistency

const samlCert = fs.readFileSync(path.join(__dirname, '../config/samlCert.pem'), 'utf-8');

const samlOptions = {
    entryPoint: process.env.SAML_ENTRYPOINT,
    issuer: process.env.SAML_ISSUER,
    protocol: process.env.SAML_PROTOCOL,
    logoutUrl: process.env.SAML_LOGOUTURL,
    cert: samlCert, // Adding the certificate here
    validateInResponseTo: true,
    passive: false,
    disableRequestedAuthnContext: true
};

const strategy = new SamlStrategy(samlOptions, (profile, done) => {
    userProfile = profile;
    done(null, userProfile);
});

passport.use(strategy);

router.get('/login', passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/consume', passport.authenticate('saml', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    console.log('SAML Response Body:', req.body);  // Log the raw SAML response
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    if (req.user == null) {
        return res.redirect('/');
    }

    strategy.logout(req, (err, uri) => {
        if (err) {
            console.error('Logout Error:', err);  // Log errors during logout
            return res.redirect('/');
        }
        req.logout();
        userProfile = null;
        return res.redirect(uri);
    });
});

router.get('/failed', (req, res) => {
    res.status(401).send('Login failed');
});

module.exports = router;
