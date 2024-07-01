import React from 'react';

function Navbar() {
  const handleLogout = () => {
    window.location.href = 'https://localhost:3000/app/logout';
  };

  return (
    <nav className="navbar">
      <h1>SAML x MERN</h1>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
