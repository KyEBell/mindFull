import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import styles from '../styles/DashboardCalendar.module.css';

interface DashboardCalendarProps {
  //   datesWithEntries: string[];
  onDateClick: (date: Date) => void;
}
const journalDatesUrl =
  import.meta.env.VITE_BASE_API_URL + 'journal-entries/summary';

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  //   datesWithEntries, might need this later
  onDateClick,
}) => {
  const [highlightedDates, setHighlightedDates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    console.log('use effect in dashboard calendar');
    const fetchDatesWithEntries = async () => {
      try {
        const response = await fetch(journalDatesUrl, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          //   console.log('data from backend', data);
          const datesObject = data.reduce((acc, entry) => {
            const dateString = new Date(entry.user_selected_date)
              .toISOString()
              .split('T')[0];
            acc[dateString] = true;
            return acc;
          }, {} as { [key: string]: boolean });

          console.log('dates object', datesObject);

          setHighlightedDates(datesObject);
        }
      } catch (error) {
        console.error('Error fetching dates with entries:', error);
      }
    };

    fetchDatesWithEntries();
  }, []);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return (
        highlightedDates[dateString] && <div className={styles.highlight}></div>
      );
    }
    return null;
  };

  return <Calendar onClickDay={onDateClick} tileContent={tileContent} />;
};

export default DashboardCalendar;
