import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import useAuth from "./hooks/useAuth";
import NotAuthorized from "./pages/NotAuthorized";
import AdminPage from "./pages/AdminPage";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import { useUser } from "./contexts/UserContext";
import useAuthorization from "./hooks/useAuthorization";
import { bouncy } from "ldrs";

function App() {
  bouncy.register();
  const { authenticated, loading: authLoading } = useAuth();
  const { userProfile } = useUser();
  const username = userProfile.username;
  const { isAuthorized, loading: authzLoading, error } = useAuthorization(username, 'write', 'adminPanel');

  // Combine loading states and check if there's an error (optional)
  // if (authLoading || authzLoading) {
  if (isAuthorized === (false || null) || authLoading || authzLoading) {
    // console.log(isAuthorized);
    return <div className="h-screen w-screen flex justify-center items-center">
      <l-bouncy
        size="45"
        speed="1.75"
        color="white"
      ></l-bouncy></div>;
  }

  // if (error) {
  //   console.error("Authorization Error:", error);
  //   return <div>Error checking authorization.</div>;
  // }

  return (
    <Router>
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={authenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/admin"
          // element={authenticated ? (isAuthorized ? <AdminPage /> : <Navigate to="/not-authorized" />) : <Navigate to="/" />}
          element={authenticated ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route path="/eventcreate"
          element={authenticated ? (isAuthorized ? <CreateEvent /> : <Navigate to="/not-authorized" />) : <Navigate to="/" />}
        />
        <Route path="/events/:id"
          element={authenticated ? <EventDetails /> : <Navigate to="/" />}
        />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
