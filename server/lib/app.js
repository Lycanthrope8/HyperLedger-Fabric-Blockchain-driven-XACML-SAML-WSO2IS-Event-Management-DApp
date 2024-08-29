const grpc = require('@grpc/grpc-js');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { TextDecoder } = require('util');



function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}


const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault(
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

// Path to user private key directory.
const keyDirectoryPath = envOrDefault(
    'KEY_DIRECTORY_PATH',
    path.resolve(
        cryptoPath,
        'users',
        'User1@org1.example.com',
        'msp',
        'keystore'
    )
);

// Path to user certificate directory.
const certDirectoryPath = envOrDefault(
    'CERT_DIRECTORY_PATH',
    path.resolve(
        cryptoPath,
        'users',
        'User1@org1.example.com',
        'msp',
        'signcerts'
    )
);

// Path to peer tls certificate.
const tlsCertPath = envOrDefault(
    'TLS_CERT_PATH',
    path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt')
);

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const utf8Decoder = new TextDecoder();


async function newGrpcConnection() {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity() {
    const certPath = await getFirstDirFileName(certDirectoryPath);
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

async function newSigner() {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function getContractInstance(gateway, channelName, chaincodeName) {
    const network = await gateway.getNetwork(channelName);
    return network.getContract(chaincodeName);
}

async function enforceAccessControl(subject, action, resource) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePEP');
        const result = await contract.submitTransaction('enforce', subject, action, resource);
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}

async function evaluatePolicy(request) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePDP');
        const result = await contract.evaluateTransaction('evaluate', JSON.stringify(request));
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}

async function setRole(username, roles) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        await contract.submitTransaction('setRole', username, roles);
        return "Role set successfully";
    } finally {
        gateway.close();
        client.close();
    }
}

async function getRole(username) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.evaluateTransaction('getRole', username);
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}

async function addPolicy(policyId, policyXml) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePAP');
        await contract.submitTransaction('addPolicy', policyId, policyXml);
        return "Policy added successfully";
    } finally {
        gateway.close();
        client.close();
    }
}

async function getPolicy(policyId) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePAP');
        const result = await contract.evaluateTransaction('getPolicy', policyId);
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}

async function getAllPolicies() {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePAP');
        const result = await contract.evaluateTransaction('getAllPolicies');
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}
async function getAllUsers() {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.evaluateTransaction('getAllUsers');
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}

async function getUsersByRole(role) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.evaluateTransaction('getUsersByRole', role);
        return utf8Decoder.decode(result);
    } finally {
        gateway.close();
        client.close();
    }
}

async function checkUserExists(username) {
    const client = await newGrpcConnection();
    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
    });
    try {
        const contract = await getContractInstance(gateway, channelName, 'chaincodePIP');
        const result = await contract.submitTransaction('checkUserExists', username);
        return utf8Decoder.decode(result);
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