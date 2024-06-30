import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/app/status', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.authenticated);
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3000/app/logout', { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome</h1>
          {!isAuthenticated ? (
            <a href="http://localhost:3000/app/login">Sign in using SSO</a>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </header>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

function Login() {
  return (
    <div>
      <h2>Login Page</h2>
      <a href="http://localhost:3000/app/login">Sign in using SSO</a>
    </div>
  );
}

export default App;
