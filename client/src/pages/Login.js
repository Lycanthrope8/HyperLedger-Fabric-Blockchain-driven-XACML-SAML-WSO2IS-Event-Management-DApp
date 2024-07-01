import React from 'react';
import { Navigate } from 'react-router-dom';

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

export default Login;
