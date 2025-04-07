import React, { createContext, useState, useEffect } from 'react';
// import * as jwtDecode from "jwt-decode";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Function to check if a token is valid
  const isValidToken = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Expiry check
    } catch (error) {
      return false;
    }
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        setAccessToken(data.access);
      } else {
        logout(); // Logout if refresh fails
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  };

  // Login function: Fetch tokens and store them
  const login = async (username, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { access, refresh } = await response.json();
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('username', username);

      // Decode user details from token
      const decoded = jwtDecode(access);
      const userData = { id: decoded.user_id, username: decoded.username, email: decoded.email };
      localStorage.setItem('user', JSON.stringify(userData));

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function: Clear tokens and user data
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Protect initial load by checking if token is valid
  useEffect(() => {
    if (!isValidToken(accessToken)) {
      logout();
    }
  }, []);

  // Function to send requests with JWT token
  const requestWithToken = async (url, options = {}) => {
    // Verify the token before making the request
    if (!isValidToken(accessToken)) {
      logout();
      throw new Error('Access token expired or invalid. Logging out.');
    }

    // Merge the authorization header with any other headers
    const authorizedOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}` // Attach the token here
      }
    };

    // Make the request using fetch
    const response = await fetch(url, authorizedOptions);

    // Optional: if you get a 401 Unauthorized from the backend, log the user out immediately
    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized. Logging out.');
    }
    return response;
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout, requestWithToken }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;