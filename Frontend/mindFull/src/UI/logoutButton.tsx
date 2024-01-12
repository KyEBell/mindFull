import React from 'react';
import styles from '../styles/Navbar.module.css';

interface LogoutButtonProps {
  onClick: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => (
  <li className={styles.navItem}>
    <button onClick={onClick}>Logout</button>
  </li>
);

export default LogoutButton;
