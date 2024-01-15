import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import LogoutModal from './LogoutModal';
import Notification from './Notification';
import useNotification from '../hooks/useNotification';
import NavbarLinks from './NavBarLinks';
import LogoutButton from '../UI/logoutButton';

interface NavBarProps {
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface HttpError {
  status: number;
  message: string;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const navigate = useNavigate();
  const logoutUrl = import.meta.env.VITE_BASE_API_URL + 'logout';

  const { showNotification, handleNotification } = useNotification();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
      closeLogoutModal();
      handleNotification(3000);
      navigate('/');
    } catch (error: unknown) {
      const knownError = error as HttpError;
      console.error('Logout failed:', knownError.message);
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link
        to={isAuthenticated ? '/Dashboard' : '/'}
        className={styles.navbarBrand}>
        mindFull
      </Link>

      <NavbarLinks isAuthenticated={isAuthenticated} />

      {showNotification && (
        <Notification message='You have been successfully logged out.' />
      )}

      {isAuthenticated && <LogoutButton onClick={openLogoutModal} />}

      {isLogoutModalOpen && (
        <LogoutModal
          closeModal={closeLogoutModal}
          confirmLogout={confirmLogout}
        />
      )}
    </nav>
  );
};

export default NavBar;
