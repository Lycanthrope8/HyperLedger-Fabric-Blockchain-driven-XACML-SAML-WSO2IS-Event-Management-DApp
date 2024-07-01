import React from 'react';

function Navbar() {
  const handleLogout = () => {
    window.location.href = 'https://localhost:3000/app/logout';
  };

  return (
    <nav className="navbar">
      <h1>App Name</h1>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
