import React from 'react';
import styles from '../styles/SuccessModal.module.css';

interface SuccessModalProps {
  returnToDashboard: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  returnToDashboard,
  message,
}) => {
  return (
    <div className={styles.successModalOverlay}>
      <div className={styles.successModal}>
        <p>{message}</p>
        <button onClick={returnToDashboard}>Return to Dashboard</button>
      </div>
    </div>
  );
};

export default SuccessModal;
