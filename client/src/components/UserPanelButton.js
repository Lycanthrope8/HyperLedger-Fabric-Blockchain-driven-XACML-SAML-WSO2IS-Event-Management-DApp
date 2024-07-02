import React, { useState } from "react";
import "./Button.css";

const UserPanelButton = () => {
  const [userInfo, setUserInfo] = useState(null);

  const handleUserClick = async () => {
    try {
      // Fetch user profile information from backend
      const userInfoResponse = await fetch("https://localhost:3000/app/user-info", {
        method: "GET",
        credentials: "include",
      });

      if (!userInfoResponse.ok) {
        throw new Error(`Failed to fetch user info! Status: ${userInfoResponse.status}`);
      }

      const userData = await userInfoResponse.json();
      setUserInfo(userData);

      // Check user access via backend API
      const checkAccessResponse = await fetch("https://localhost:3000/app/check-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          resource: "/user-panel",
          action: "GET",
        }),
        credentials: "include",
      });

      if (checkAccessResponse.status === 403) {
        // Handle unauthorized access without throwing an error
        alert("You are not authorized for this resource");
        return;
      }

      if (!checkAccessResponse.ok) {
        throw new Error(`Access check failed! Status: ${checkAccessResponse.status}`);
      }

      const accessData = await checkAccessResponse.json();

      if (accessData.redirect) {
        window.location.href = accessData.redirect;
      }
    } catch (error) {
      console.error("Error fetching user info or checking access:", error);
      alert("Error fetching user info or checking access: " + error.message);
    }
  };

  return (
    <button className="panel-button" onClick={handleUserClick}>
      User Panel
    </button>
  );
};

export default UserPanelButton;
