// Home.js
import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";

function Home() {
  const { userInfo, loading, error } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App h-screen bg-gradient-linear">
      <Navbar />
      <div className="w-full h-full flex justify-evenly items-center">
      </div>
    </div>
  );
}

export default Home;
