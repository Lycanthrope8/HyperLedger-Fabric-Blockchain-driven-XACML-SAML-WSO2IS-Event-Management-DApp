"use strict";

const pdpQuery = require("../middlewares/pdpQuery");
const { JSDOM } = require("jsdom");

const extractUserProfile = (profile) => {
  return {
    displayName: profile[process.env.WSO2_DISPLAYNAME_CLAIM] || "",
    email: profile[process.env.WSO2_EMAIL_CLAIM] || "",
    firstName: profile[process.env.WSO2_FIRSTNAME_CLAIM] || "",
    fullName: profile[process.env.WSO2_FULLNAME_CLAIM] || "",
    lastName: profile[process.env.WSO2_LASTNAME_CLAIM] || "",
    phoneNumbers: profile[process.env.WSO2_PHONENUMBERS_CLAIM] || [],
    roles: profile[process.env.WSO2_ROLE_CLAIM] || [],
    username: profile[process.env.WSO2_USERNAME_CLAIM] || "",
  };
};

const getUserProfile = (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
};

const checkUserAccess = async (req, res) => {
  const { username, resource, action } = req.body;

  try {
    const pdpResponse = await pdpQuery(username, resource, action);

    // Create a DOM from the XML response
    const dom = new JSDOM(pdpResponse, { contentType: "text/xml" });
    const xmlDoc = dom.window.document;

    // Extract the decision from the XML
    const decision = xmlDoc.querySelector("Decision").textContent;

    console.log("Decision:", decision);

    if (decision === "Permit") {
      // Send a JSON response for redirection
      res.json({ redirect: `https://localhost:3001${resource}`});
    } else {
      // Handle "Deny" and "NotApplicable" cases
      res
        .status(403)
        .json({ message: "You are not authorized for this resource" });
    }
  } catch (error) {
    console.error("Error in PDP request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  extractUserProfile,
  getUserProfile,
  checkUserAccess,
};
