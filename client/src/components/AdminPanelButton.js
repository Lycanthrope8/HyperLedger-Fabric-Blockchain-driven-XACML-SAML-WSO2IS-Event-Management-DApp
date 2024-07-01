import React from 'react';
import './Button.css';

function AdminPanelButton() {
  const handleAdminClick = () => {
    // Implement the logic for navigating to the admin panel
    console.log('Navigating to Admin Panel');
  };

  return (
    <button className="panel-button" onClick={handleAdminClick}>Admin Panel</button>
  );
}

export default AdminPanelButton;
