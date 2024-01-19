import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import useAuth from '../hooks/useAuth';

const NavbarLinks: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ul className={styles.navbarNav}>
      {!isAuthenticated && (
        <>
          <li className={styles.navItem}>
            <NavLink
              to='/login'
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }>
              Login
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to='/signup'
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }>
              Signup
            </NavLink>
          </li>
        </>
      )}

      <li className={styles.navItem}>
        <NavLink
          to='/about'
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.navLink
          }>
          About
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to='/contact'
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.navLink
          }>
          Contact
        </NavLink>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to='/resources'
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.navLink
          }>
          Resources
        </NavLink>
      </li>
    </ul>
  );
};

export default NavbarLinks;
