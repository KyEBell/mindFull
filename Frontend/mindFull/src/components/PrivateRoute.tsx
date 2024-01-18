import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface PrivateRouteProps {
  element: React.ReactElement;
}

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
const PrivateRoute: React.FC<PrivateRouteProps> = () => {
  const { isAuthenticated } = useAuth();
  console.log('is authenticated from privateRoute', isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
