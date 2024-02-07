import React, { ReactNode, useState } from 'react';
import { AuthContext } from './AuthContext';
interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const setAndLogUser = (newUser: User | null) => {
    setUser((prevUser) => {
      if (prevUser === newUser) {
        return prevUser;
      }
      return newUser;
    });
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser: setAndLogUser as React.Dispatch<
          React.SetStateAction<User | null>
        >,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
