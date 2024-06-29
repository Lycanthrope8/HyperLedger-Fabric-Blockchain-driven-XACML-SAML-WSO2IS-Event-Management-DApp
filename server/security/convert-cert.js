// convert-cert.js

const fs = require('fs');
const path = require('path');

// Paths to the DER and PEM files
const derCertPath = path.join(__dirname, './IdPCertificate.cer');
const pemCertPath = path.join(__dirname, './IdPCertificate.pem');

// Read DER certificate
const derCert = fs.readFileSync(derCertPath);

// Convert DER to PEM
const pemCert = `-----BEGIN CERTIFICATE-----\n${derCert.toString('base64').match(/.{0,64}/g).join('\n')}\n-----END CERTIFICATE-----`;

// Save the PEM certificate
fs.writeFileSync(pemCertPath, pemCert);

console.log('Certificate converted to PEM format and saved as IdPCertificate.pem');
