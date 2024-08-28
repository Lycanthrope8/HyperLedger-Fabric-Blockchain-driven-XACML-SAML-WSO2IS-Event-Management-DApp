"use strict";

const { JSDOM } = require("jsdom");

const extractUserProfile = (profile) => {
  // console.log("Profile:", profile);
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
module.exports = {
  extractUserProfile,
};
