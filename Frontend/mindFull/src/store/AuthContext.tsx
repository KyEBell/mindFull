import { createContext } from 'react';
interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export { AuthContext };
