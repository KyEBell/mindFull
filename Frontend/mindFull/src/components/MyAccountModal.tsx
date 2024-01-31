import React, { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import useAuth from '../hooks/useAuth';

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
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const openDeleteConfirmation = () => setIsDeleteConfirmationOpen(true);
  const closeDeleteConfirmation = () => setIsDeleteConfirmationOpen(false);

  const handleEdit = () => {
    // Implement your edit logic here
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
    <div>
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
        <button onClick={handleEdit}>Edit User Info</button>
        <button onClick={handleDelete}>Delete User</button>
        <button onClick={onClose}>Close</button>
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
  );
};

export default MyAccountModal;
