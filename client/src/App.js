import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import useAuth from './hooks/useAuth';
import UserPanel from './pages/UserPanel'
import AdminPanel from './pages/AdminPanel';

function App() {
  const { authenticated } = useAuth();
  console.log(authenticated)

  return (
    <Router>
      <Routes>
        <Route path="/home" element={authenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/" element={<Login authenticated={authenticated} />} />
        <Route path="/user-panel" element={authenticated ? <UserPanel /> : <Navigate to="/home" />} />
        <Route path="/admin-panel" element={authenticated ? <AdminPanel /> : <Navigate to="/home" />} />

      </Routes>
    </Router>
  );
}

export default App;
