import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('saas_auth_token'));
  const [loading, setLoading] = useState(true);

  // Configure axios to include JWT in all requests if token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('saas_auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('saas_auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Attempt to restore user profile from localStorage token on mount
  useEffect(() => {
    const checkUserSession = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // Fetch stats which will validate token and return user details
        const response = await axios.get('/api/dashboard/stats');
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          // Token is invalid
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to validate session token:', err);
        // Clean up session if network error or validation failure is 401/403
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Email might be in use.';
      return { success: false, message };
    }
  };

  const loginWithGoogle = async (googleCredential) => {
    try {
      const response = await axios.post('/api/auth/google-login', { credential: googleCredential });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message = err.response?.data?.message || 'Google Sign-In failed.';
      return { success: false, message };
    }
  };

  const updateLocalUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('saas_auth_token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    loginWithGoogle,
    updateLocalUser,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
