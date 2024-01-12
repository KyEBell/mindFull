import React from 'react';
import styles from '.././styles/Notification.module.css';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <div className={styles.notification}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
