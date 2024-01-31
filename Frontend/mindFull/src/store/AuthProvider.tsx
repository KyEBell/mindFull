import React, { ReactNode, useState } from 'react';
import { AuthContext } from './AuthContext';
interface AuthProviderProps {
  children: ReactNode;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
