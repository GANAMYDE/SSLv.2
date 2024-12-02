import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Import Navigate for redirection
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './assets/Dashboard.css';

function App() {
  const navigate = useNavigate();

  // Check if the user is authenticated (stored in localStorage)
  const isAuthenticated = localStorage.getItem('user');

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    navigate('/'); // Redirect to login
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      return <Navigate to="/" />;
    }
    return children; // If authenticated, render the children (Dashboard)
  };

  // Optional: Redirect to login on token expiry or invalid user session
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Public Route: Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Route: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
