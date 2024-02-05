import { useState } from 'react';
import useNotification from './useNotification';
import { useNavigate } from 'react-router-dom';
interface HttpError {
  status: number;
  message: string;
}

const userActionUrl = import.meta.env.VITE_BASE_API_URL + 'users/';

const useAccountActions = () => {
  const navigate = useNavigate();
  const { handleNotification } = useNotification();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const openDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen((prevState) => !prevState);
  };

  const handleEdit = () => {
    // Implement edit logic here
  };

  const handleDelete = () => {
    openDeleteConfirmation();
  };

  const confirmDelete = async (userId: string) => {
    try {
      const response = await fetch(`${userActionUrl}${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      console.log('response', response);
      if (!response.ok) {
        throw new Error('Delete user failed');
      }
      if (response.ok) {
        console.log(`${userId} successfully deleted`);
        handleNotification(3000);
        navigate('/');
      }
    } catch (error) {
      const knownError = error as HttpError;
      console.error('Error Deleting user', knownError.message);
    }
  };

  return {
    isDeleteConfirmationOpen,
    openDeleteConfirmation,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
};

export default useAccountActions;
