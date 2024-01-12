import { useState } from 'react';

interface NotificationHook {
  showNotification: boolean;
  handleNotification: (duration: number) => void;
}

const useNotification = (): NotificationHook => {
  const [showNotification, setShowNotification] = useState(false);

  const handleNotification: NotificationHook['handleNotification'] = (
    duration: number
  ) => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  return { showNotification, handleNotification };
};

export default useNotification;
