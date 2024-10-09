const fabricFunctions = require('../lib/app'); // Adjust the path if necessary

const enforceAccessControl = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { subject, action, resource } = req.body;
        const result = await fabricFunctions.enforceAccessControl(subject, action, resource);
        res.send(`Result: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const evaluatePolicy = async (req, res) => {
    try {
        const result = await fabricFunctions.evaluatePolicy(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const setRole = async (req, res) => {
    try {
        const { username, roles } = req.body;
        await fabricFunctions.setRole(username, roles);
        res.send(`Role set successfully for ${username}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const getRole = async (req, res) => {
    try {
        const result = await fabricFunctions.getRole(req.body.username);
        res.send(`Role Data: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const addPolicy = async (req, res) => {
    try {
        const { policyId, policyXml } = req.body;
        await fabricFunctions.addPolicy(policyId, policyXml);
        res.send(`Policy added successfully with ID: ${policyId}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const getPolicy = async (req, res) => {
    try {
        const result = await fabricFunctions.getPolicy(req.body.policyId);
        res.send(`Policy Data: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const getAllPolicies = async (req, res) => {
    try {
        const result = await fabricFunctions.getAllPolicies();
        res.send(result);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await fabricFunctions.getAllUsers();
        res.send(result);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.body;
        const result = await fabricFunctions.getUsersByRole(role);
        res.send(`Users with role ${role}: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

const checkUserExists = async (req, res) => {
    try {
        const { username } = req.body;
        const result = await fabricFunctions.checkUserExists(username);
        res.send(`Check Result: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
};

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
    checkUserExists
};
