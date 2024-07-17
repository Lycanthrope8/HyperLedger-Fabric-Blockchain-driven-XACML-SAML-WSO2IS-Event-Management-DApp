// Home.js
import React from 'react';
import AdminPanelButton from '../components/AdminPanelButton';
import UserPanelButton from '../components/UserPanelButton';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

function Home() {
  const { userInfo, loading, error } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="button-container">
        <AdminPanelButton/>
        <UserPanelButton/>
      </div>
    </div>
  );
}

export default Home;
