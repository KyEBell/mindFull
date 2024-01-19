import React from 'react';
import styles from '../styles/Dashboard.module.css';
import useAuth from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className={styles.dashH1}>
        Welcome to your dashboard, {user?.username}!
      </h1>
    </div>
  );
};

export default Dashboard;
