import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import WriteJournalPage from '../pages/Dashboard/WriteJournalPage';
import SplashPage from '../pages/SplashPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ResourcePage from '../pages/ResourcePage';
import JournalsPage from '../pages/JournalsPages/JournalsPage';
import JournalDates from '../pages/JournalsPages/JournalDates';

export const routes = (
  <Routes>
    <Route path='/' element={<SplashPage />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/signup' element={<SignUpPage />} />
    <Route path='/about' element={<AboutPage />} />
    <Route path='/contact' element={<ContactPage />} />
    <Route path='/resources' element={<ResourcePage />} />
    <Route
      path='/dashboard/*'
      element={
        <PrivateRoute>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path='/write' element={<WriteJournalPage />} />
            <Route path='/review' element={<JournalDates />} />
            <Route path='/review/:id' element={<JournalsPage />} />
          </Routes>
        </PrivateRoute>
      }
    />
  </Routes>
);
