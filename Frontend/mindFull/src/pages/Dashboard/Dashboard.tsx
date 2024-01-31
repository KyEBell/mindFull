import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardCalendar from '../../components/DashboardCalendar';

//FULL DASHBOARD COMPONENT
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleDateClick = async (date: Date, id: number) => {
    const dateString = date.toISOString().split('T')[0];
    const dateUrl =
      import.meta.env.VITE_BASE_API_URL + `journal-entries/date/${dateString}`;

    try {
      const response = await fetch(dateUrl, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 1) {
        navigate(`dashboard/review/date/${dateString}`);
      } else if (Array.isArray(data)) {
        navigate(`/dashboard/review/${id}`);
      }
    } catch (error) {
      console.error('Error fetching entries for the date:', error);
    }
  };

  return (
    <>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashH1}>
          Welcome to your dashboard, {user?.username}!
        </h1>
        <div className={styles.calendarContainer}>
          <DashboardCalendar onDateClick={handleDateClick} />
        </div>
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardContent}>
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
    </>
  );
};

export default Dashboard;
