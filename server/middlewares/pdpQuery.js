const fs = require('fs').promises;
const fetch = require('node-fetch');
const https = require('https');
const base64 = require('base-64');
require('dotenv').config();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const pdpQuery = async (username, resource, action) => {
    try {
        const accessControlXML = await fs.readFile('./auth/access-control.xml', 'utf8');
        const xacmlRequest = accessControlXML
            .replace('{{resource}}', resource)
            .replace('{{username}}', username)
            .replace('{{action}}', action);

        const pdpResponse = await fetch('https://localhost:9447/api/identity/entitlement/decision/pdp', {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + base64.encode(`${process.env.WSO2_ADMIN}:${process.env.WSO2_ADMIN_PASS}`),
                'Content-Type': 'application/xml',
                Accept: 'application/xml',
            },
            body: xacmlRequest,
            agent, // Use the custom agent
        });

        if (!pdpResponse.ok) {
            throw new Error(`XACML PDP HTTP error! Status: ${pdpResponse.status}`);
        }

        return await pdpResponse.text();
    } catch (error) {
        console.error('Error in PDP request:', error);
        throw error;
    }
};

module.exports = pdpQuery; // Exporting the pdpQuery function
