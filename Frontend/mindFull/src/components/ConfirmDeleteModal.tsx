import React from 'react';
import styles from '../styles/ConfirmDeleteModal.module.css';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className={styles.confirmationModalOverlay}>
      <div className={styles.confirmationModal}>
        <p>{message}</p>
        <button className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.confirm} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
