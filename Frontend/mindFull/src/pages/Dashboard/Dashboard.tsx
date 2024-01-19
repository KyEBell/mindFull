import React from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';
import useAuth from '../../hooks/useAuth';
import WriteJournalPage from './WriteJournalPage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <h1 className={styles.dashH1}>
        Welcome to your dashboard, {user?.username}!
      </h1>
      <div>
        <Link to='write' className={styles.dashboardLink}>
          Write Today's Journal
        </Link>
        <br></br>
        <Link to='/review' className={styles.dashboardLink}>
          Review Journals
        </Link>
      </div>
    </>
  );
};

export default Dashboard;
