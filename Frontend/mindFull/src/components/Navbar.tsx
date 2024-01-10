import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

interface NavBarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };
  return (
    <nav className={styles.navbar}>
      <Link to='/Dashboard' className={styles.navbarBrand}>
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
        {isAuthenticated && (
          <li className={styles.navItem}>
            <button onClick={handleLogout}>Logout</button>
          </li>
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
      </ul>
    </nav>
  );
};

export default NavBar;
