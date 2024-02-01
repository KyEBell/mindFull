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

  const setAndLogUser = (prevUser: User | null) => {
    if (prevUser) {
      setUser((prevState) => {
        if (prevState && prevState.id === prevUser.id) {
          // No need to update if the user ID remains the same
          return prevState;
        }
        return {
          ...prevState!,
          ...prevUser,
        };
      });
    }
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
