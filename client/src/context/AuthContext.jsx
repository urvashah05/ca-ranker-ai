import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Create instances of axios with default configuration
const API = axios.create({
  baseURL: '/api',
});

// Automatically inject JWT Token into headers for API requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ca_ranker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ca_ranker_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile if token exists on application mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await API.get('/auth/profile');
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Signup User
  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/signup', userData);
      if (data.success) {
        localStorage.setItem('ca_ranker_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setLoading(false);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup.');
      setLoading(false);
      return false;
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('ca_ranker_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setLoading(false);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
      return false;
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('ca_ranker_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        signup,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
