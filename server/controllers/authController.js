"use strict";

const passport = require("../config/passport-config");
const { checkUserExists, setDefaultRole } = require("./xacmlController"); // Import setDefaultRole

const redirectToLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/app/login");
  }
  next();
};

const handleLogin = passport.authenticate("saml", {
  successRedirect: "https://localhost:3001/",
  failureRedirect: "/app/failed",
  failureFlash: true,
});

const handleSamlConsume = (req, res, next) => {
  passport.authenticate(
    "saml",
    {
      failureRedirect: "/app/failed",
      failureFlash: true,
    },
    async (err, user, info) => {
      if (err || !user) {
        return res.redirect("/app/failed");
      }

      // After successful login, check if the user exists in the ledger
      try {
        const username = user.username; // Assuming the username comes from the user object
        const checkResponse = await checkUserExists({ body: { username } });
        const checkResult = checkResponse; // Assuming checkUserExists returns the parsed response

        if (checkResult && checkResult.exists !== undefined) {
          if (!checkResult.exists) {
            console.log(
              `User ${username} does not exist in the ledger. Setting default role...`
            );
            await setDefaultRole(username, "user"); // Assign the default role
            console.log(`Default role 'user' set for ${username}.`);
          } else {
            console.log(`User ${username} exists in the ledger.`);
          }
        } else {
          console.error(
            "Invalid response from checkUserExists:",
            checkResponse
          );
        }
      } catch (error) {
        console.error("Error checking if user exists:", error);
      }

      // If everything is fine, proceed with login
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.redirect("https://localhost:3001/");
      });
    }
  )(req, res, next);
};

const handleSamlConsumeRedirect = async (req, res) => {
  // Similar logic as handleSamlConsume
  try {
    const username = req.user.username; // Assuming req.user contains the logged-in user info
    const checkResponse = await checkUserExists({ body: { username } });

    // Ensure checkResponse has an 'exists' property
    if (checkResponse && checkResponse.exists !== undefined) {
      if (!checkResponse.exists) {
        console.log(
          `User ${username} does not exist in the ledger. Setting default role...`
        );
        await setDefaultRole(username, "user"); // Assign the default role
        console.log(`Default role 'user' set for ${username}.`);
      } else {
        console.log(`User ${username} exists in the ledger.`);
      }
    } else {
      console.error("Invalid response from checkUserExists:", checkResponse);
    }
  } catch (error) {
    console.error("Error checking if user exists:", error);
  }

  return res.redirect("https://localhost:3001/");
};

const handleLogout = (req, res) => {
  console.log("User logged out");
  if (!req.isAuthenticated() || req.user == null) {
    return res.redirect("https://localhost:3001/");
  }

  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout");
    }
    return res.redirect("https://localhost:9447/samlsso");
  });
};

const handleFailedLogin = (req, res) => {
  res.status(401).json({ message: "Login failed" });
};

const checkAuthStatus = (req, res) => {
  console.log("Checking authentication status...");
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
};

module.exports = {
  redirectToLogin,
  handleLogin,
  handleSamlConsume,
  handleSamlConsumeRedirect,
  handleLogout,
  handleFailedLogin,
  checkAuthStatus,
};
