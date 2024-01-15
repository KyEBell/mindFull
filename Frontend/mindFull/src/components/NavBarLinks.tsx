import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

interface NavbarLinksProps {
  isAuthenticated: boolean | null;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ isAuthenticated }) => (
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
  </ul>
);

export default NavbarLinks;
