import React from 'react';
import AdminPanelButton from '../components/AdminPanelButton';
import UserPanelButton from '../components/UserPanelButton';
import Navbar from '../components/Navbar';
import useUserInfo from '../hooks/useUserInfo';


function Home() {

  const { userInfo, loading, error } = useUserInfo();

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
        <AdminPanelButton userInfo={userInfo} />
        <UserPanelButton userInfo={userInfo} />
      </div>
    </div>
  );
}

export default Home;
