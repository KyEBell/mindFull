import React from 'react';
import styles from '.././styles/LogOutModal.module.css';

interface LogoutModalProps {
  closeModal: () => void;
  confirmLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  closeModal,
  confirmLogout,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>Are you sure you want to logout?</p>
        <button onClick={confirmLogout}>LOGOUT</button>
        <button onClick={closeModal}>CANCEL</button>
      </div>
    </div>
  );
};

export default LogoutModal;
