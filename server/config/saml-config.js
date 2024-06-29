const path = require("path");
const fs = require("fs");

module.exports = {
  samlOptions: {
    entryPoint: process.env.SAML_ENTRYPOINT,
    issuer: process.env.SAML_ISSUER,
    protocol: process.env.SAML_PROTOCOL,
    logoutUrl: process.env.SAML_LOGOUTURL,
              // Uncomment and set `cert` if you have a specific certificate for SAML
    // cert: fs.readFileSync(path.join(__dirname, 'path-to-certificate.pem'), 'utf-8'),
    validateInResponseTo: true, // Added for security to validate the SAML response
    passive: false, // Added to ensure the user is redirected to the IdP for login
    disableRequestedAuthnContext: true, // Disable the requestedAuthnContext for compatibility
  },
};
