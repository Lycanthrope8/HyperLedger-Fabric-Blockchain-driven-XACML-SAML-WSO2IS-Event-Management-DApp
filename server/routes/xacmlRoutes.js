const express = require('express');
const router = express.Router();
const fabricFunctions = require('../lib/app'); // Adjust this path as necessary

// Endpoint for enforcing access control
router.post('/enforce', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { subject, action, resource } = req.body;
        const result = await fabricFunctions.enforceAccessControl(subject, action, resource);
        res.send(`Result: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});


// Endpoint for evaluating policy
router.post('/evaluate', async (req, res) => {
    try {
        const result = await fabricFunctions.evaluatePolicy(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for setting role
router.post('/setRole', async (req, res) => {
    try {
        const { username, roles } = req.body;
        await fabricFunctions.setRole(username, roles);
        res.send(`Role set successfully for ${username}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for getting role
router.post('/getRole', async (req, res) => {
    try {
        const result = await fabricFunctions.getRole(req.body.username);
        res.send(`Role Data: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for adding policy
router.post('/addPolicy', async (req, res) => {
    try {
        const { policyId, policyXml } = req.body;
        await fabricFunctions.addPolicy(policyId, policyXml);
        res.send(`Policy added successfully with ID: ${policyId}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for getting a single policy
router.post('/getPolicy', async (req, res) => {
    try {
        const result = await fabricFunctions.getPolicy(req.body.policyId);
        res.send(`Policy Data: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for getting all policies
router.get('/getAllPolicies', async (req, res) => {
    try {
        const result = await fabricFunctions.getAllPolicies();
        res.send(result);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for getting all users
router.get('/getAllUsers', async (req, res) => {
    try {
        const result = await fabricFunctions.getAllUsers();
        res.send(result);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for getting users by role
router.post('/getUsersByRole', async (req, res) => {
    try {
        const { role } = req.body;
        const result = await fabricFunctions.getUsersByRole(role);
        res.send(`Users with role ${role}: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});

// Endpoint for checking if a user exists and adding default role if not
router.post('/checkUserExists', async (req, res) => {
    try {
        const { username } = req.body;
        const result = await fabricFunctions.checkUserExists(username);
        res.send(`Check Result: ${result}`);
    } catch (error) {
        res.status(500).send("Error processing request: " + error.message);
    }
});


module.exports = router;
