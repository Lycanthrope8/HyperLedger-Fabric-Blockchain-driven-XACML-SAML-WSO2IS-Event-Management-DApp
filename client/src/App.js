import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import NotAuthorized from "./pages/NotAuthorized";
import useAuth from "./hooks/useAuth";
import { UserProvider } from "./context/UserContext";

function App() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Add a loading screen or spinner here if desired
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/home"
            element={authenticated ? <Home /> : <Navigate to="/" />}
          />
          <Route path="/" element={<Login authenticated={authenticated} />} />
          <Route
            path="/user-panel"
            element={authenticated ? <UserPanel /> : <Navigate to="/" />}
          />
          <Route
            path="/admin-panel"
            element={authenticated ? <AdminPanel /> : <Navigate to="/" />}
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
