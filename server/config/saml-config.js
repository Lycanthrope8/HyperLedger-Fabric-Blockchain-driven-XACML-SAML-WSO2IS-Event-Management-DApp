require('dotenv').config();
const path = require('path');
const fs = require('fs');

module.exports = {
    entryPoint: process.env.SAML_ENTRYPOINT,
    issuer: process.env.SAML_ISSUER,
    protocol: process.env.SAML_PROTOCOL,
    logoutUrl: process.env.SAML_LOGOUTURL,
    cert: fs.readFileSync(path.join(__dirname, process.env.IDP_CERTIFICATE_PATH), 'utf-8'),
    validateInResponseTo: true,
    passive: false,
    disableRequestedAuthnContext: true,
    
    roleClaim: process.env.WSO2_ROLE_CLAIM,
    emailClaim: process.env.WSO2_EMAIL_CLAIM,
    firstNameClaim: process.env.WSO2_FIRSTNAME_CLAIM,
    fullNameClaim: process.env.WSO2_FULLNAME_CLAIM,
    lastNameClaim: process.env.WSO2_LASTNAME_CLAIM,
    phoneNumbersClaim: process.env.WSO2_PHONENUMBERS_CLAIM,
    usernameClaim: process.env.WSO2_USERNAME_CLAIM,
};
