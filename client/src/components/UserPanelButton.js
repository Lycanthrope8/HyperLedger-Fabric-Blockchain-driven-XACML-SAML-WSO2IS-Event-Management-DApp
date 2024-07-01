import React from 'react';
import './Button.css';

function UserPanelButton() {
  const handleUserClick = async () => {
    try {
      const response = await fetch('https://localhost:3000/app/user-info', {
        method: 'GET',
        credentials: 'include',  // Include credentials (cookies) in the request
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User Info:', data);  

      
      alert(`
        Display Name: ${data.displayName}
        Email: ${data.email}
        First Name: ${data.firstName}
        Full Name: ${data.fullName}
        Last Name: ${data.lastName}
        Phone Numbers: ${data.phoneNumbers.join(', ')}
        Roles: ${data.roles}
        Username: ${data.username}
      `);

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <button className="panel-button" onClick={handleUserClick}>User Panel</button>
  );
}

export default UserPanelButton;
