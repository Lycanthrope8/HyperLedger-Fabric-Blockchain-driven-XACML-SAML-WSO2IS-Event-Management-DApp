import React from "react";
import { Navigate } from "react-router-dom";
import "../components/Button.css";

function Login({ authenticated }) {
  if (authenticated) {
    return <Navigate to="/home" />;
  }

  function handleLogin() {
    window.location.href = "https://localhost:3000/app/login";
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Please sign in</h1>
        {/* <a className="panel-button" href="https://localhost:3000/app/login">Sign in using SSO</a> */}
        <button className="panel-button" onClick={handleLogin}>
          Sign In using SSO
        </button>
      </header>
    </div>
  );
}

export default Login;
