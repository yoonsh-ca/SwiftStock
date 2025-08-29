import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
}
