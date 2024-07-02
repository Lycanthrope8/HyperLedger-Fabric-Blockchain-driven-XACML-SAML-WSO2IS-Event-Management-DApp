import React from 'react';
import useCheckUserAccess from '../hooks/useCheckUserAccess';
import "./Button.css";

const AdminPanelButton = ({ userInfo }) => {
  const { checkUserAccess, loading, error } = useCheckUserAccess();

  const handleAdminClick = async () => {
    try {
      if (!userInfo) {
        throw new Error("User info is not available");
      }

      const redirectUrl = await checkUserAccess(userInfo.username, "/admin-panel", "GET");

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (error) {
        alert(error);
      }
    } catch (error) {
      console.error("Error handling admin click:", error);
      alert("Error handling admin click: " + error.message);
    }
  };

  return (
    <button className="panel-button" onClick={handleAdminClick} disabled={loading}>
      {loading ? "Loading..." : "Admin Panel"}
    </button>
  );
};

export default AdminPanelButton;
