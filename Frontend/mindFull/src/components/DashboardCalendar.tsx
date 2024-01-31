import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../styles/DashboardCalendar.module.css';

interface DashboardCalendarProps {
  onDateClick: (date: Date, id: number) => void;
}
const journalDatesUrl =
  import.meta.env.VITE_BASE_API_URL + 'journal-entries/summary';

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  onDateClick,
}) => {
  const [highlightedDates, setHighlightedDates] = useState<{
    [key: string]: { highlighted: boolean; id: number };
  }>({});

  useEffect(() => {
    const fetchDatesWithEntries = async () => {
      try {
        const response = await fetch(journalDatesUrl, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          const datesObject = data.reduce((acc, entry) => {
            const dateString = new Date(entry.user_selected_date)
              .toISOString()
              .split('T')[0];
            acc[dateString] = {
              highlighted: true,
              id: entry.id,
            };
            return acc;
          }, {} as { [key: string]: { highlighted: boolean; id: number } });

          setHighlightedDates(datesObject);
        }
      } catch (error) {
        console.error('Error fetching dates with entries:', error);
      }
    };

    fetchDatesWithEntries();
  }, []);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return highlightedDates[dateString] ? styles.highlightedContent : '';
    }
  };

  return (
    <Calendar
      onClickDay={(date) => {
        const dateString = date.toISOString().split('T')[0];
        const idInfo = highlightedDates[dateString];
        if (idInfo) {
          const { id } = idInfo;
          onDateClick(date, id);
        }
      }}
      tileClassName={tileClassName}
    />
  );
};

export default DashboardCalendar;
