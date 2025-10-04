import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
