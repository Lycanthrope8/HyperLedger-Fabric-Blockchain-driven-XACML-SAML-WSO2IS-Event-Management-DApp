import React from 'react';
import useAuthorization from '../hooks/useAuthorization'; // Make sure this path matches where you save your hook file

function Navbar() {
  const subject = 'alice.smith';
  const action = 'write';
  const resource = 'adminPanel';

  const { isAuthorized, loading, error } = useAuthorization(subject, action, resource);

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = 'https://localhost:3000/app/logout';
  };

  const handleAdmin = () => {
    console.log('Admin clicked');
    if (isAuthorized) {
      window.location.href = 'https://localhost:3000/app/admin';
    } else {
      alert('You are not authorized to access the admin page.');
    }
  };

  return (
    <nav className="w-full text-zinc-50 bg-[#2a2438] h-max py-2 px-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">SAML x MERN</h1>
      <div>
        {error && <div className="text-red-500">Error: {error.message || 'Server error'}</div>}
        {isAuthorized && !loading && !error && (
          <button
            className="bg-[#5c5470] py-2 px-4 rounded-full hover:brightness-105 mr-4"
            onClick={handleAdmin}
          >
            Admin
          </button>
        )}
        <button
          className="bg-[#5c5470] py-2 px-4 rounded-full hover:brightness-105"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
