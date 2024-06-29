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
    disableRequestedAuthnContext: true
};
