import React from 'react';
import styles from '../styles/ConfirmDeleteModal.module.css';
import Notification from './Notification';
import useNotification from '../hooks/useNotification';

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
  const { showNotification } = useNotification();

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
        {showNotification && (
          <Notification message='you have successFully deleted your account' />
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
