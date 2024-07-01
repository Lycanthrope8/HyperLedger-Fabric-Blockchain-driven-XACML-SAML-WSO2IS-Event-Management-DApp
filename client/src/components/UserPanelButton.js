import React from 'react';
import './Button.css';

function UserPanelButton() {
  const handleUserClick = () => {
    // Implement the logic for navigating to the user panel
    console.log('Navigating to User Panel');
  };

  return (
    <button className="panel-button" onClick={handleUserClick}>User Panel</button>
  );
}

export default UserPanelButton;
