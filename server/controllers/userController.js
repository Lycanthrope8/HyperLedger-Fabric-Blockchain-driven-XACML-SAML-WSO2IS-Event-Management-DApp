"use strict";

const { JSDOM } = require("jsdom");




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
