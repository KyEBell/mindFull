import React, { useState, useEffect } from 'react';
import styles from '../../styles/Dashboard.module.css';
import { Link } from 'react-router-dom';

const JournalDates: React.FC = () => {
  const [dates, setDates] = useState<
    Array<{ id: number; user_selected_date: string }>
  >([]);

  const journalDatesUrl =
    import.meta.env.VITE_BASE_API_URL + 'journal-entries/summary';
  // console.log('journaldatesURL', journalDatesUrl);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(journalDatesUrl, {
          method: 'GET',

          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // console.log('DATA FROM journalDATES FRONTEND', data);
            setDates(data);
          }
        } else {
          console.error('Failed to fetch journal dates');
        }
      } catch (error) {
        console.error('Error fetching journal dates:', error);
      }
    };

    fetchDates();
  }, [journalDatesUrl]);

  // console.log('DATES', dates);
  return (
    <div>
      <h2 className={styles.dashH1}>Journal Entries by Date:</h2>
      <ul>
        {dates.map((element) => (
          <li key={element.id}>
            <Link to={`/dashboard/review/${element.id}`}>
              {element.user_selected_date}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalDates;
