import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './assets/Dashboard.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated by checking localStorage
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (isAuthenticated === null) {
      // While checking auth, show a loading indicator
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      return <Navigate to="/" />;
    }

    return children; // If authenticated, render the children (Dashboard)
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
