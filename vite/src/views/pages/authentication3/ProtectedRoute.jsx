import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated
  const isAuthenticated = sessionStorage.getItem('accessToken');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render the child routes/components if authenticated
};

export default ProtectedRoute;
