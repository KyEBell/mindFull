import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import LogoutModal from './LogoutModal';
import Notification from './Notification';

interface NavBarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleNotification = (message: string, duration: number) => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    closeLogoutModal();
    handleNotification('You have been successfully logged out', 3000);
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link
        to={isAuthenticated ? '/Dashboard' : '/'}
        className={styles.navbarBrand}>
        mindFull
      </Link>
      <ul className={styles.navbarNav}>
        {!isAuthenticated && (
          <>
            <li className={styles.navItem}>
              <Link to='/login' className={styles.navLink}>
                Login
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to='/signup' className={styles.navLink}>
                Signup
              </Link>
            </li>
          </>
        )}

        <li className={styles.navItem}>
          <Link to='/about' className={styles.navLink}>
            About
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to='/contact' className={styles.navLink}>
            Contact
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to='/resources' className={styles.navLink}>
            Resources
          </Link>
        </li>
        {showNotification && (
          <Notification
            message='You have been successfully logged out.'
            onClose={() => setShowNotification(false)}
          />
        )}
        {isAuthenticated && (
          <li className={styles.navItem}>
            <button onClick={openLogoutModal}>Logout</button>
          </li>
        )}
      </ul>
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
