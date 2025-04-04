import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../authentication/auth-forms/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem('accessToken');

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
