import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import LogoutModal from './LogoutModal';
import Notification from './Notification';
import useNotification from '../hooks/useNotification';
import NavbarLinks from './NavBarLinks';
import LogoutButton from '../UI/logoutButton';
import useAuth from '../hooks/useAuth';
import DashboardNavButton from '../UI/DashboardNavButton';
import MyAccountModal from './MyAccountModal';
import useAccountActions from '../hooks/useAccountActions';

interface HttpError {
  status: number;
  message: string;
}

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const logoutUrl = import.meta.env.VITE_BASE_API_URL + 'logout';

  const { showNotification, handleNotification } = useNotification();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMyAccountModalOpen, setIsMyAccountModalOpen] = useState(false);
  const openMyAccountModal = () => setIsMyAccountModalOpen(true);
  const closeMyAccountModal = () => setIsMyAccountModalOpen(false);
  const returnToDashboard = () => navigate('/dashboard');
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const confirmLogout = async () => {
    try {
      const response = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setIsAuthenticated(false);
      setUser(null);
      closeLogoutModal();
      handleNotification(3000);
      navigate('/');
    } catch (error: unknown) {
      const knownError = error as HttpError;
      console.error('Logout failed:', knownError.message);
    }
  };

  const { isDeleteConfirmationOpen, handleDelete } = useAccountActions();

  return (
    <nav className={styles.navbar}>
      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        className={styles.navbarBrand}>
        mindFull
      </Link>

      <NavbarLinks />

      {showNotification && (
        <Notification message='You have been successfully logged out.' />
      )}
      {isAuthenticated && (
        <button onClick={openMyAccountModal}>My Account</button>
      )}

      {isMyAccountModalOpen && (
        <MyAccountModal
          onClose={closeMyAccountModal}
          onEdit={() => {}}
          onDelete={() => handleDelete()}
        />
      )}
      {isAuthenticated && <DashboardNavButton onClick={returnToDashboard} />}

      {isAuthenticated && <LogoutButton onClick={openLogoutModal} />}

      {isLogoutModalOpen && (
        <LogoutModal
          closeModal={closeLogoutModal}
          confirmLogout={confirmLogout}
        />
      )}
      {isDeleteConfirmationOpen && <div className={styles.overlay}></div>}
    </nav>
  );
};

export default NavBar;
