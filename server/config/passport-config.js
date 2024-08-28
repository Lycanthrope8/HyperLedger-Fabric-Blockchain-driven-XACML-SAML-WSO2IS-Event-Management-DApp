const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const samlConfig = require('./saml-config');
const { extractUserProfile } = require('../controllers/userController');

// Configure SAML Strategy
passport.use(new SamlStrategy(samlConfig, (profile, done) => {
    const userProfile = extractUserProfile(profile);
    console.log('SAML Profile:', userProfile);
    done(null, userProfile);
}));

// Serialize User
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize User
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
