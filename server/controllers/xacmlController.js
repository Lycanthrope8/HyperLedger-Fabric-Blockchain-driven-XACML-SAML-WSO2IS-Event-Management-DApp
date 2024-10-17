const { set } = require("mongoose");
const fabricFunctions = require("../lib/app"); // Adjust the path if necessary

const enforceAccessControl = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    const { subject, action, resource } = req.body;
    const result = await fabricFunctions.enforceAccessControl(
      subject,
      action,
      resource
    );
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

const setDefaultRole = async (username, roles) => {
  try {
    await fabricFunctions.setRole(username, roles);
    return `Role set successfully for ${username}`;
  } catch (error) {
    console.error(`Error setting role: ${error.message}`);
    throw error; // Throw the error to be caught by the caller
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
    // Ensure the result is in the expected format
    return JSON.parse(result);
  } catch (error) {
    console.error("Error in checkUserExists:", error);
    return res.status(500).json({ error: "Error checking user existence" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { username } = req.params; // Get username from the route parameters
    if (!username) {
      return res.status(400).send("Username is required");
    }
    await fabricFunctions.deleteUser(username); // Call the deleteUser fabric function
    res.send(`User ${username} deleted successfully`);
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
};

const removeRole = async (req, res) => {
  try {
    const { username, role } = req.body;
    await fabricFunctions.removeRole(username, role); // Assuming the function exists in fabricFunctions
    res.send(`Role ${role} removed successfully for ${username}`);
  } catch (error) {
    res.status(500).send("Error removing role: " + error.message);
  }
};

module.exports = {
  enforceAccessControl,
  evaluatePolicy,
  setRole,
  setDefaultRole,
  getRole,
  addPolicy,
  getPolicy,
  getAllPolicies,
  getAllUsers,
  getUsersByRole,
  checkUserExists,
  deleteUser,
  removeRole,
};
