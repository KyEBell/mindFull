import React, { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import useAuth from '../hooks/useAuth';
import styles from '../styles/MyAccountModal.module.css';

interface MyAccountModalProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MyAccountModal: React.FC<MyAccountModalProps> = ({
  onClose,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  console.log('USER', user);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const openDeleteConfirmation = () => setIsDeleteConfirmationOpen(true);
  const closeDeleteConfirmation = () => setIsDeleteConfirmationOpen(false);

  const handleEdit = () => {
    // Implement edit logic here
    // Make API call to update user info
    onEdit();
  };

  const handleDelete = () => {
    //open delete modal here
    openDeleteConfirmation();
  };

  const confirmDelete = () => {
    // Make API call to delete user HERE!!!
    onDelete();
    closeDeleteConfirmation();
  };

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
              onConfirm={confirmDelete}
              onCancel={closeDeleteConfirmation}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MyAccountModal;
