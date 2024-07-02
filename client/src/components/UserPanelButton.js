import React from "react";
import useCheckUserAccess from "../hooks/useCheckUserAccess";
import "./Button.css";

const UserPanelButton = () => {
  const { checkUserAccess, loading, error } = useCheckUserAccess();

  const handleUserClick = async () => {
    try {
      const userInfoResponse = await fetch("https://localhost:3000/app/user-info", {
        method: "GET",
        credentials: "include",
      });

      if (!userInfoResponse.ok) {
        throw new Error(`Failed to fetch user info! Status: ${userInfoResponse.status}`);
      }

      const userData = await userInfoResponse.json();

      const redirectUrl = await checkUserAccess(userData.username, "/user-panel", "GET");

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (error) {
        alert(error);
      }
    } catch (error) {
      console.error("Error fetching user info or checking access:", error);
      alert("Error fetching user info or checking access: " + error.message);
    }
  };

  return (
    <button className="panel-button" onClick={handleUserClick} disabled={loading}>
      {loading ? "Loading..." : "User Panel"}
    </button>
  );
};

export default UserPanelButton;
