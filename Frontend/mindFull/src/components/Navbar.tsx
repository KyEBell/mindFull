import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

interface NavBarProps {
  isAuthenticated: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {
  return (
    <nav className={styles.navbar}>
      <Link to='/' className={styles.navbarBrand}>
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
            <button onClick={() => console.log('Logout clicked')}>
              Logout
            </button>
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
