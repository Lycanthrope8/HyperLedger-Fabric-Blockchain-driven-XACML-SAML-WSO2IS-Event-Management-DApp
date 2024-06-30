'use strict';

const passport = require('passport');
let userProfile;

const SamlStrategy = require('passport-saml').Strategy;
const samlConfig = require('../config/saml-config');

// Configure SAML Strategy for Passport
const strategy = new SamlStrategy(samlConfig, (profile, done) => {
    userProfile = profile;
    console.log('SAML Profile:', profile);  // Log the SAML profile
    done(null, userProfile);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const redirectToLogin = (req, res, next) => {
    if (!req.isAuthenticated() || userProfile == null) {
        return res.redirect('/app/login');
    }
    next();
};

const handleLogin = passport.authenticate('saml', {
    successRedirect: '/app',
    failureRedirect: '/app/login',
    failureFlash: true
});

const handleSamlConsume = (req, res, next) => {
    console.log('SAML Response Body:', req.body);  // Log the SAML response
    passport.authenticate('saml', {
        failureRedirect: '/app/failed',
        failureFlash: true
    })(req, res, next);
};

const handleSamlConsumeRedirect = (req, res) => {
    if (req.body.SAMLResponse) {
        const base64String = req.body.SAMLResponse;
        const xmlString = Buffer.from(base64String, 'base64').toString('utf-8');
        console.log('SAML XML Response:', xmlString);  // Log the SAML XML response
    }
    return res.redirect('/app');
};

const handleLogout = (req, res) => {
    if (req.user == null) {
        return res.redirect('/app/home');
    }

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
};

const handleFailedLogin = (req, res) => {
    res.status(401).send('Login failed');
};

module.exports = {
    redirectToLogin,
    handleLogin,
    handleSamlConsume,
    handleSamlConsumeRedirect,
    handleLogout,
    handleFailedLogin
};
