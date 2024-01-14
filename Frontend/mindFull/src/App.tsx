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
// import { refreshTokenService } from './services/refreshTokenService';
// const apiUrl = import.meta.env.VITE_BASE_URL;
console.log('URL', import.meta.env.VITE_BASE_URL);
// console.log(apiUrl, 'api URL');
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  console.log('isAuthenticated', isAuthenticated);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const accessToken = localStorage.getItem('accessToken');
  //       const refreshToken = localStorage.getItem('refreshToken');
  //       console.log('accessToken from useEffect in app.tsx', accessToken);
  //       console.log('refreshToken from useEffect in app.tsx', refreshToken);

  //       if (accessToken) {
  //         console.log('entering if(accessToken)', accessToken);
  //         setIsAuthenticated(true);
  //       } else if (refreshToken) {
  //         const { accessToken: newAccessToken } = await refreshTokenService(
  //           refreshToken
  //         );
  //         localStorage.setItem('accessToken', newAccessToken);
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }

  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Token refresh error:', error);
  //       setIsLoading(false);
  //     }
  //   };
  //   checkAuthentication();
  // }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(apiUrl + 'check-auth');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.log(
          'authentication failed in the checkAuth catch from frontend',
          error
        );
        setIsAuthenticated(false);
      }
    };
    checkAuthentication();
  }, []);
  // console.log('isAuthenticated:', isAuthenticated);
  if (isAuthenticated === null) {
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
