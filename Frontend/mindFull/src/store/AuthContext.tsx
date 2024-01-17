import { createContext } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export { AuthContext };
