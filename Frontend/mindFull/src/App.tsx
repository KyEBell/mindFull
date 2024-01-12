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
import { refreshTokenService } from './services/refreshTokenService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  console.log('isAuthenticated', isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('accessToken from useEffect in app.tsx', accessToken);
        console.log('refreshToken from useEffect in app.tsx', refreshToken);
        console.log('localStorage', localStorage);

        if (accessToken) {
          console.log('entering if(accessToken)', accessToken);
          setIsAuthenticated(true);
        } else if (refreshToken) {
          const { accessToken: newAccessToken } = await refreshTokenService(
            refreshToken
          );
          localStorage.setItem('accessToken', newAccessToken);
          setIsAuthenticated(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Token refresh error:', error);
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

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
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/resources' element={<ResourcePage />} />
      </Routes>
    </Router>
  );
};

export default App;
