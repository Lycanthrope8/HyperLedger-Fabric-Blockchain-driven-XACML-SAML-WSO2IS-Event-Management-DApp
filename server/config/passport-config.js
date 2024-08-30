const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const samlConfig = require('./saml-config');

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


const extractUserProfile = (profile) => {
    return {
      displayName: profile[process.env.WSO2_DISPLAYNAME_CLAIM] || "",
      email: profile[process.env.WSO2_EMAIL_CLAIM] || "",
      firstName: profile[process.env.WSO2_FIRSTNAME_CLAIM] || "",
      fullName: profile[process.env.WSO2_FULLNAME_CLAIM] || "",
      lastName: profile[process.env.WSO2_LASTNAME_CLAIM] || "",
      phoneNumbers: profile[process.env.WSO2_PHONENUMBERS_CLAIM] || [],
      roles: profile[process.env.WSO2_ROLE_CLAIM] || [],
      username: profile[process.env.WSO2_USERNAME_CLAIM] || "",
    };
  };
  

module.exports = passport;
