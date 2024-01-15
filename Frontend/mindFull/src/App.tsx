import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import SignUpPage from './pages/SignUpPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResourcePage from './pages/ResourcePage';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
console.log('base api url', baseApiUrl);
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log('isAuthenticated from APP tsx', isAuthenticated);

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
        } else {
          setIsAuthenticated(false);
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
      <NavBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path='/' element={<SplashPage />} />
        <Route
          path='/login'
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute
              element={<Dashboard />}
              isAuthenticated={isAuthenticated}
            />
          }>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route
          path='/signup'
          element={<SignUpPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/resources' element={<ResourcePage />} />
      </Routes>
    </Router>
  );
};

export default App;
