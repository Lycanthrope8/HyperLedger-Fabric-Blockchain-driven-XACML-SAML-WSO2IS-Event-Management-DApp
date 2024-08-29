import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthorization from '../hooks/useAuthorization';

function Navbar() {
  const navigate = useNavigate();

  const { isAuthorized, loading, error } = useAuthorization('alice.smith', 'write', 'adminPanel');

  // Consider keeping the loading state until authorization is confirmed
  const isLoading = loading || !isAuthorized;

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/app/logout');
  };

  const handleAdmin = () => {
    console.log('Admin clicked');
    if (isAuthorized) {
      navigate('/admin');
    } else {
      alert('You are not authorized to access the admin page.');
    }
  };

  return (
    <nav className="w-full text-zinc-50 bg-[#2a2438] h-max py-2 px-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">SAML x MERN</h1>
      <div>
        {error && <div className="text-red-500">Error: {error.message || 'Server error'}</div>}
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
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
