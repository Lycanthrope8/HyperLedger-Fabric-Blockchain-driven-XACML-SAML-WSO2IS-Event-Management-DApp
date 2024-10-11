import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthorization from '../hooks/useAuthorization';
import { useUser } from '../contexts/UserContext';

function Navbar() {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const username = userProfile.username;
  // console.log('Username:', username);
  const { isAuthorized, loading, error } = useAuthorization(username, 'write', 'roles');

  const isLoading = loading || !isAuthorized;

  // console.log('Is authorized:', isAuthorized);

  const handleLogout = () => {
    console.log('Logging out...');
    // window.location.href = `https://localhost:9447/samlsso?slo=true&spEntityID=localhost&returnTo=${url}`;
    window.location.href = "https://localhost:3000/app/logout";
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
    <nav className="w-full text-zinc-50 bg-[#ececf2] h-max py-2 px-4 flex justify-between items-center">
      <h1 onClick={() => navigate("/")} className="text-zinc-800 text-2xl font-bold cursor-pointer">SAML x MERN</h1>
      <div>
        {error && <div className="text-red-500">Error: {error.message || 'Server error'}</div>}
        {isAuthorized && (
          <button
            className="bg-[#e74b2d] font-medium py-2 px-4 rounded  hover:brightness-110 transition-all mr-4"
            onClick={handleAdmin}
          >
            Admin
          </button>
        )}
        <button
          className="bg-[#e74b2d] font-medium py-2 px-4 rounded  hover:brightness-110 transition-all"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
