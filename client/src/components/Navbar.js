import React from 'react';

function Navbar() {
  const handleLogout = () => {
    window.location.href = 'https://localhost:3000/app/logout';
  };

  return (
    <nav className="absolute w-full text-zinc-50 bg-[#2a2438] h-max py-2 px-4 flex justify-between items-center">
      <h1 className='text-2xl font-bold'>SAML x MERN</h1>
      <button className='bg-[#5c5470] py-2 px-4 rounded-full hover:brightness-105' onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
