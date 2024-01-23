import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';
import useAuth from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <h1 className={styles.dashH1}>
          Welcome to your dashboard, {user?.username}!
        </h1>
        <div className={styles.linksContainer}>
          <Link to='write' className={styles.dashboardLink}>
            Write Today's Journal
          </Link>
          <br />
          <Link to='review' className={styles.dashboardLink}>
            Review Journals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
