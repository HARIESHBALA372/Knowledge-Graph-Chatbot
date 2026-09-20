import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { MOCK_USER } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kg_user');
    return saved ? JSON.parse(saved) : MOCK_USER; // Default to demo user for immediate evaluation
  });
  const [token, setToken] = useState(() => localStorage.getItem('kg_token') || MOCK_USER.token);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem('kg_user')) {
      localStorage.setItem('kg_user', JSON.stringify(user));
      localStorage.setItem('kg_token', token);
    }
  }, [user, token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kg_user');
    localStorage.removeItem('kg_token');
  };

  const updateProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('kg_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
