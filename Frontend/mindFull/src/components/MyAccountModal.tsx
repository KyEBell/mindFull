import React from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import useAuth from '../hooks/useAuth';
import styles from '../styles/MyAccountModal.module.css';
import useAccountActions from '../hooks/useAccountActions';

interface MyAccountModalProps {
  onClose: () => void;
}

const MyAccountModal: React.FC<MyAccountModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const {
    isDeleteConfirmationOpen,
    openDeleteConfirmation,
    handleEdit,
    handleDelete,
    confirmDelete,
  } = useAccountActions();

  return (
    <>
      {isDeleteConfirmationOpen && <div className={styles.overlay}></div>}
      <div className={styles.myAccountModalOverlay}>
        <div className={styles.myAccountModal}>
          {/* Display user information */}
          <div>
            <h2>User Information</h2>
            <p>Username: {user?.username}</p>
            <p>Email: {user?.email}</p>
          </div>

          {/* Edit form */}
          <div>
            <h2>Edit Information</h2>
            {/* Implement your edit form fields here */}
          </div>

          <div>
            <button onClick={handleEdit} className={styles.editButton}>
              Edit User Info
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete User
            </button>
            <button onClick={onClose} className={styles.closeButton}>
              Close
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteConfirmationOpen && (
            <ConfirmDeleteModal
              message='Are you sure you want to delete your account?'
              onConfirm={() => confirmDelete(user?.id || '')}
              onCancel={openDeleteConfirmation}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MyAccountModal;
