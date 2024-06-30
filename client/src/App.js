import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('https://localhost:3000/app/status', { withCredentials: true })
      .then(response => {
        setAuthenticated(response.data.authenticated);
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  const handleLogout = () => {
    axios.get('https://localhost:3000/app/logout', { withCredentials: true })
      .then(response => {
        setAuthenticated(false);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Router>
      <Routes>
        <Route path="/home" element={authenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/" element={<Login authenticated={authenticated} />} />
      </Routes>
    </Router>
  );
}

function Home({ handleLogout }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
    </div>
  );
}

function Login({ authenticated }) {
  if (authenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Please sign in</h1>
        <a href="https://localhost:3000/app/login">Sign in using SSO</a>
      </header>
    </div>
  );
}

export default App;
