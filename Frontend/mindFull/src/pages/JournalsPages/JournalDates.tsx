import React, { useState, useEffect } from 'react';
import styles from '../../styles/Dashboard.module.css';
import { Link, useParams } from 'react-router-dom';
import { formatSelectedDate } from '../../utilities/dateFormat';

const JournalDates: React.FC = () => {
  const { date } = useParams<{ date?: string }>();

  const [dates, setDates] = useState<
    Array<{ id: number; user_selected_date: string }>
  >([]);

  const journalDatesUrl = date
    ? import.meta.env.VITE_BASE_API_URL + `journal-entries/date/${date}`
    : import.meta.env.VITE_BASE_API_URL + 'journal-entries/summary';
  console.log('journaldatesURL', journalDatesUrl);

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
            // setDates(data);
            const formattedDates = data.map((journalEntry) => ({
              ...journalEntry,
              user_selected_date: formatSelectedDate(
                journalEntry.user_selected_date
              ),
            }));
            formattedDates.sort((a, b) => {
              const dateA = a.user_selected_date
                ? new Date(a.user_selected_date)
                : null;
              const dateB = b.user_selected_date
                ? new Date(b.user_selected_date)
                : null;

              return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
            });

            setDates(formattedDates);
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
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashH1}>
        {date ? `Journal Entries for ${date}` : 'All Journal Entries'}:
      </h2>
      <ul className={styles.journalDatesList}>
        {dates.map((element, index) => (
          <li key={element.id} className={styles.journalEntryItem}>
            <Link
              to={`/dashboard/review/${element.id}`}
              className={styles.journalEntryItem}>
              Entry {index + 1}
              <span className={styles.journalEntryDate}>
                {element.user_selected_date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalDates;
