import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FrontDeskDashboard from './pages/FrontDeskDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const ProtectedRoute = ({ role, children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('ProtectedRoute checking token:', token);
    if (!token) {
      console.log('No token, redirecting to /login');
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.user?.role;
      console.log('Decoded role:', userRole, 'Expected role:', role);
      if (userRole !== role) {
        console.log('Role mismatch, redirecting to /login');
        navigate('/login');
      }
    } catch (err) {
      console.log('Token decode error:', err);
      navigate('/login');
    }
  }, [token, role, navigate]);

  return token ? children : null;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/frontdesk"
          element={
            <ProtectedRoute role="FrontDesk">
              <FrontDeskDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="Doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;