import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const HostRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    toast.warn('Please log in to access this page.');
    return <Navigate to="/login" />;
  }

  if (user && user.role !== 'host') {
    toast.error('You do not have permission to view this page. Host access required.');
    return <Navigate to="/" />; // Redirect to home or a different unauthorized page
  }

  return children;
};

export default HostRoute;