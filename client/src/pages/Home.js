import React from 'react';
import AdminPanelButton from '../components/AdminPanelButton';
import UserPanelButton from '../components/UserPanelButton';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="App">
      <Navbar />
      <div className="button-container">
        <AdminPanelButton />
        <UserPanelButton />
      </div>
    </div>
  );
}

export default Home;
