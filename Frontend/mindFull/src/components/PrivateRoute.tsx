import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
interface PrivateRouteProps {
  isAuthenticated: boolean;
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
