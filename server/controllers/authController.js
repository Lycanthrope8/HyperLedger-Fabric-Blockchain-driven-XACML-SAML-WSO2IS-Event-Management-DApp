'use strict';

const passport = require('passport');
const { extractUserProfile } = require('../controllers/userController');  

const SamlStrategy = require('passport-saml').Strategy;
const samlConfig = require('../config/saml-config');

// Configure SAML Strategy for Passport
const strategy = new SamlStrategy(samlConfig, (profile, done) => {
    const userProfile = extractUserProfile(profile);  
    // console.log('SAML Profile:', userProfile);  
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
    if (!req.isAuthenticated()) {
        return res.redirect('/app/login');
    }
    next();
};

const handleLogin = passport.authenticate('saml', {
    successRedirect: 'https://localhost:3001/',   
    failureRedirect: '/app/failed',
    failureFlash: true
});

const handleSamlConsume = (req, res, next) => {
    // console.log('SAML Response Body:', req.body);   
    passport.authenticate('saml', {
        failureRedirect: '/app/failed',
        failureFlash: true
    })(req, res, next);
};

const handleSamlConsumeRedirect = (req, res) => {
    if (req.body.SAMLResponse) {
        const base64String = req.body.SAMLResponse;
        const xmlString = Buffer.from(base64String, 'base64').toString('utf-8');
        console.log('SAML XML Response:', xmlString);   
    }
    return res.redirect('https://localhost:3001/');  
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

        return res.redirect('https://localhost:9443/samlsso');  
    });
};

const handleFailedLogin = (req, res) => {
    res.status(401).json({ message: 'Login failed' });
};

const checkAuthStatus = (req, res) => {
    if (req.isAuthenticated()) {
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
