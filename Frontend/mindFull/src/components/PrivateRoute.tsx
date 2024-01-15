import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
interface PrivateRouteProps {
  isAuthenticated: boolean | null;
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
  console.log('is authenticated from privateRoute', isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
