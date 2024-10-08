const grpc = require('@grpc/grpc-js');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { TextDecoder } = require('util');
const net = require('net');

function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}

const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials for Org1.
const cryptoPathOrg1 = envOrDefault(
    'CRYPTO_PATH',
    path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'test-network',
        'organizations',
        'peerOrganizations',
        'org1.example.com'
    )
);

// Path to crypto materials for Org2.
const cryptoPathOrg2 = envOrDefault(
    'CRYPTO_PATH',
    path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'test-network',
        'organizations',
        'peerOrganizations',
        'org2.example.com'
    )
);

// Org1 configurations (main)
const peerEndpointOrg1 = 'localhost:7051';
const peerHostAliasOrg1 = 'peer0.org1.example.com';
const tlsCertPathOrg1 = path.resolve(
    cryptoPathOrg1,
    'peers',
    'peer0.org1.example.com',
    'tls',
    'ca.crt'
);

// Org2 configurations (fallback)
const peerEndpointOrg2 = 'localhost:9051';
const peerHostAliasOrg2 = 'peer0.org2.example.com';
const tlsCertPathOrg2 = path.resolve(
    cryptoPathOrg2,
    'peers',
    'peer0.org2.example.com',
    'tls',
    'ca.crt'
);

// Path to user private key directory for Org1.
const keyDirectoryPathOrg1 = envOrDefault(
    'KEY_DIRECTORY_PATH',
    path.resolve(
        cryptoPathOrg1,
        'users',
        'User1@org1.example.com',
        'msp',
        'keystore'
    )
);

// Path to user private key directory for Org2.
const keyDirectoryPathOrg2 = envOrDefault(
    'KEY_DIRECTORY_PATH',
    path.resolve(
        cryptoPathOrg2,
        'users',
        'User1@org2.example.com',
        'msp',
        'keystore'
    )
);

// Path to user certificate directory for Org1.
const certDirectoryPathOrg1 = envOrDefault(
    'CERT_DIRECTORY_PATH',
    path.resolve(
        cryptoPathOrg1,
        'users',
        'User1@org1.example.com',
        'msp',
        'signcerts'
    )
);

// Path to user certificate directory for Org2.
const certDirectoryPathOrg2 = envOrDefault(
    'CERT_DIRECTORY_PATH',
    path.resolve(
        cryptoPathOrg2,
        'users',
        'User1@org2.example.com',
        'msp',
        'signcerts'
    )
);

const utf8Decoder = new TextDecoder();

// Retry mechanism with exponential backoff
async function retryWithBackoff(retries, fn) {
    let delay = 1000; // Initial delay in ms
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
    throw new Error('Failed after multiple retries');
}

async function isPeerAvailable(peerEndpoint) {
    const [host, port] = peerEndpoint.split(':');
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(2000); // Timeout after 2 seconds
        socket
            .connect(port, host, () => {
                socket.end();
                resolve(true); // Peer is available
            })
            .on('error', () => {
                socket.end();
                resolve(false); // Peer is unavailable
            })
            .on('timeout', () => {
                socket.end();
                resolve(false); // Peer timed out
            });
    });
}

async function newGrpcConnection() {
    return retryWithBackoff(3, async () => {
        // Attempt connection to Org1 peer first
        if (await isPeerAvailable(peerEndpointOrg1)) {
            console.log("Connecting to Org1 peer...");
            const tlsRootCert = await fs.readFile(tlsCertPathOrg1);
            const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
            return new grpc.Client(peerEndpointOrg1, tlsCredentials, {
                'grpc.ssl_target_name_override': peerHostAliasOrg1,
            });
        }

        // If Org1 is down, fallback to Org2 peer
        if (await isPeerAvailable(peerEndpointOrg2)) {
            console.log("Org1 peer unavailable, connecting to Org2 peer...");
            const tlsRootCertOrg2 = await fs.readFile(tlsCertPathOrg2);
            const tlsCredentialsOrg2 = grpc.credentials.createSsl(tlsRootCertOrg2);
            return new grpc.Client(peerEndpointOrg2, tlsCredentialsOrg2, {
                'grpc.ssl_target_name_override': peerHostAliasOrg2,
            });
        }

        throw new Error('No available peers found');
    });
}

async function newIdentity(org) {
    const certPath = org === 'Org1' ? await getFirstDirFileName(certDirectoryPathOrg1) : await getFirstDirFileName(certDirectoryPathOrg2);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath) {
    const files = await fs.readdir(dirPath);
    if (files.length === 0) {
        throw new Error(`No files found in directory: ${dirPath}`);
    }
    return path.join(dirPath, files[0]);
}

async function newSigner(org) {
    const keyPath = org === 'Org1' ? await getFirstDirFileName(keyDirectoryPathOrg1) : await getFirstDirFileName(keyDirectoryPathOrg2);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

// Function to get contract instance
async function getContractInstance(gateway, channelName, chaincodeName) {
    const network = await gateway.getNetwork(channelName);
    return network.getContract(chaincodeName);
}

async function enforceAccessControl(subject, action, resource) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true }, // Enable service discovery
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePEP');
        const result = await contract.submitTransaction('enforce', subject, action, resource);
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error during access control enforcement: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function evaluatePolicy(request) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePDP');
        const result = await contract.evaluateTransaction('evaluate', JSON.stringify(request));
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error during policy evaluation: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function setRole(username, roles) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        await contract.submitTransaction('setRole', username, roles);
        return "Role set successfully";
    } catch (error) {
        console.error(`Error setting role: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function getRole(username) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.evaluateTransaction('getRole', username);
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error getting role: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function addPolicy(policyId, policyXml) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePAP');
        await contract.submitTransaction('addPolicy', policyId, policyXml);
        return "Policy added successfully";
    } catch (error) {
        console.error(`Error adding policy: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function getPolicy(policyId) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePAP');
        const result = await contract.evaluateTransaction('getPolicy', policyId);
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error getting policy: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function getAllPolicies() {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePAP');
        const result = await contract.evaluateTransaction('getAllPolicies');
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error getting all policies: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function getAllUsers() {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.evaluateTransaction('getAllUsers');
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error getting all users: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function getUsersByRole(role) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.evaluateTransaction('getUsersByRole', role);
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error getting users by role: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

async function checkUserExists(username) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity('Org1'),
        signer: await newSigner('Org1'),
        discovery: { enabled: true, asLocalhost: true },
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.submitTransaction('checkUserExists', username);
        return utf8Decoder.decode(result);
    } catch (error) {
        console.error(`Error checking if user exists: ${error.message}`);
        throw error;
    } finally {
        gateway.close();
        client.close();
    }
}

module.exports = {
    enforceAccessControl,
    evaluatePolicy,
    setRole,
    getRole,
    addPolicy,
    getPolicy,
    getAllPolicies,
    getAllUsers,
    getUsersByRole,
    checkUserExists,
};
