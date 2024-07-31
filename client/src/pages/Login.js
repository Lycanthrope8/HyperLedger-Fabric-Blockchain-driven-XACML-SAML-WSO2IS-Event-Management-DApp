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
      <header className="w-full h-screen bg-gradient-linear flex justify-center items-center">
        <div className="bg-[#5C5470] rounded-xl w-3/12 h-3/6 flex gap-8 flex-col justify-center items-center">
          <h1 className="text-4xl text-zinc-50 font-montserrat">Sign In</h1>
          {/* <a className="panel-button" href="https://localhost:3000/app/login">Sign in using SSO</a> */}
          <button
            className="w-1/2 py-3 rounded-full text-zinc-50 text-md bg-[#352F44] hover:brightness-125 outline-none"
            onClick={handleLogin}
          >
            Sign In using SSO
          </button>
        </div>
      </header>
    </div>
  );
}

export default Login;
