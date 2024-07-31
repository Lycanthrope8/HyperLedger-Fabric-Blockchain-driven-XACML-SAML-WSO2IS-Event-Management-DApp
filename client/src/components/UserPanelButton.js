// UserPanelButton.js
import React from 'react';
import useCheckUserAccess from '../hooks/useCheckUserAccess';
import { useUser } from '../context/UserContext';
import "./Button.css";

const UserPanelButton = () => {
  const { userInfo } = useUser();
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
    <button className="text-[#dbd8e3] font-bold border-[#DBD8E3] border-2 rounded-full px-24 py-8 transition-all hover:bg-[#5c5470] hover:border-[#5c5470]" onClick={handleUserClick} disabled={loading}>
      {loading ? "Loading..." : "User Panel"}
    </button>
  );
};

export default UserPanelButton;
