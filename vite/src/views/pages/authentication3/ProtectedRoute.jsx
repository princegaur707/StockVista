import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../authentication/auth-forms/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return token ? children : null;
};

export default ProtectedRoute;
