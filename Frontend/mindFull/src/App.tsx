import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/Navbar';
import { routes } from './utilities/routesConfig';

import useAuth from './hooks/useAuth';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
const App: React.FC = () => {
  const { setIsAuthenticated, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(baseApiUrl + 'check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log(
          'authentication failed in the checkAuth catch from frontend',
          error
        );
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, []);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Router>
      <NavBar />
      {routes}
    </Router>
  );
};

export default App;
