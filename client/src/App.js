import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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

  // Authorization checks for different routes
  const {
    isAuthorized: isAdminAuthorized,
    loading: authzLoadingAdmin,
    error: adminAuthzError,
  } = useAuthorization(username, "write", "adminPanel");
  const {
    isAuthorized: canAccessEvents,
    loading: authzLoadingEvents,
    error: eventAuthzError,
  } = useAuthorization(username, "read", "events");

  // Combine loading states for all routes
  const isLoading = authLoading || authzLoadingAdmin || authzLoadingEvents;

  // Show loading spinner while waiting for authentication or authorization
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
      </div>
    );
  }

  // Handle authorization errors if any
  if (adminAuthzError || eventAuthzError) {
    console.error("Authorization Error:", adminAuthzError || eventAuthzError);
    return <div>Error checking authorization.</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={authenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={authenticated ? <Home /> : <Navigate to="/" />}
        />

        {/* Admin Page Authorization */}
        <Route
          path="/admin"
          element={
            authenticated ? (
              isAdminAuthorized ? (
                <AdminPage />
              ) : (
                <Navigate to="/not-authorized" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Event Creation Authorization */}
        <Route
          path="/eventcreate"
          element={
            authenticated ? (
              isAdminAuthorized ? (
                <CreateEvent />
              ) : (
                <Navigate to="/not-authorized" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Event Details Authorization */}
        <Route
          path="/events/:id"
          element={
            authenticated ? (
              canAccessEvents ? (
                <EventDetails />
              ) : (
                <Navigate to="/not-authorized" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
