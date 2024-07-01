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
    successRedirect: 'https://localhost:3001/', // Redirect to React app
    failureRedirect: '/app/failed',
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
    return res.redirect('https://localhost:3001/'); // Redirect to React app
};

const handleLogout = (req, res) => {
    if (!req.isAuthenticated() || req.user == null) {
        return res.redirect('https://localhost:3001/');
    }

    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error during logout');
        }

        userProfile = null;
        return res.redirect('https://localhost:3001'); // Redirect to IdP logout endpoint
    });
};


const handleFailedLogin = (req, res) => {
    res.status(401).json({ message: 'Login failed' });
};

const checkAuthStatus = (req, res) => {
    if (req.isAuthenticated() && userProfile != null) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
};

module.exports = {
    redirectToLogin,
    handleLogin,
    handleSamlConsume,
    handleSamlConsumeRedirect,
    handleLogout,
    handleFailedLogin,
    checkAuthStatus
};
