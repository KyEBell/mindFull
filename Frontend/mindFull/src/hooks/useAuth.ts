import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  const { isAuthenticated, setIsAuthenticated, user, setUser } = context;
  return { isAuthenticated, setIsAuthenticated, user, setUser };
};

export default useAuth;
