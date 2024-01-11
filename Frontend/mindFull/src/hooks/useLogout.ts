import { useState } from 'react';

const logoutURL = 'http://localhost:3000/api/logout/';

interface LogoutHook {
  isLogoutModalOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  showNotification: boolean;
  confirmLogout: (
    navigate: (path: string) => void,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  handleNotification: (message: string, duration: number) => void;
}

interface HttpError {
  status: number;
  message: string;
}

const useLogout = (): LogoutHook => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleNotification = (message: string, duration: number = 3000) => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  const confirmLogout = async (
    navigate: (path: string) => void,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const response = await fetch(logoutURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      setIsAuthenticated(false);
      closeLogoutModal();
      handleNotification('You have been successfully logged out');
      navigate('/');
    } catch (error: unknown) {
      const knownError = error as HttpError;
      console.error('Logout failed:', knownError.message);
      // Handle logout failure if needed
    }
  };

  return {
    isLogoutModalOpen,
    openLogoutModal,
    closeLogoutModal,
    showNotification,
    confirmLogout,
    handleNotification,
  };
};

export default useLogout;
