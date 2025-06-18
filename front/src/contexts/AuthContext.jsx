import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.token) {
        try {
          // Validate token with backend
          const res = await api.get('/auth/current-user');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify({ ...res.data, token: storedUser.token }));
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          localStorage.removeItem('user'); // Token might be invalid or expired
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Logged in successfully!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { username, email, password, role });
      toast.success('Registration successful! Please log in.');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);