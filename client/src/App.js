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

function App() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={authenticated ? <Home /> : <Navigate to="/" />}
        />
        <Route path="/" element={<Login authenticated={authenticated} />} />
        <Route
          path="/admin"
          element={authenticated ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route path="/create-event" element={authenticated ? <CreateEvent /> : <Navigate to="/" />} />
        <Route path="/event-details/:eventId" element={authenticated ? <EventDetails /> : <Navigate to="/" />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
