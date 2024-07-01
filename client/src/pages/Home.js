import React from 'react';

function Home() {
  const handleLogout = () => {
    window.location.href = 'https://localhost:3000/app/logout';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
    </div>
  );
}

export default Home;
