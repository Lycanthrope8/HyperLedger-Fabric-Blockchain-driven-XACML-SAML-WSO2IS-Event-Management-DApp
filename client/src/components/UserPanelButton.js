import React from 'react';
import useCheckUserAccess from '../hooks/useCheckUserAccess';
import "./Button.css";

const UserPanelButton = ({ userInfo }) => {
  const { checkUserAccess, loading, error } = useCheckUserAccess();

  const handleUserClick = async () => {
    try {
      if (!userInfo) {
        throw new Error("User info is not available");
      }

      const redirectUrl = await checkUserAccess(userInfo.username, "/user-panel", "GET");
      if (redirectUrl) {
        window.location.href = redirectUrl.redirect;
      } else if (error) {
        alert(error);
      }
    } catch (error) {
      console.error("Error handling user click:", error);
      alert("Error handling user click: " + error.message);
    }
  };

  return (
    <button className="panel-button" onClick={handleUserClick} disabled={loading}>
      {loading ? "Loading..." : "User Panel"}
    </button>
  );
};

export default UserPanelButton;
