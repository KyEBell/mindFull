import Dashboard from './pages/Dashboard';
import SplashPage from './pages/SplashPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import NavBar from './components/Navbar';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log('isAuthenticated', isAuthenticated);

  return (
    <Router>
      <NavBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path='/' element={<SplashPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route
          path='/login'
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
        {/* <Route path='/signup' component={SignupPage} />
        <Route path='/about' component={AboutPage} />
        <Route path='/contact' component={ContactPage} />
        <Route path='/resources' component={ResourcesPage} /> */}
      </Routes>
    </Router>
  );
};

export default App;
