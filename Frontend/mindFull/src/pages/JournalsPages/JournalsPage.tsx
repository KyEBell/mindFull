import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatSelectedDate } from '../../utilities/dateFormat';
const JournalsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [journalEntry, setJournalEntry] = useState<{
    good_thing: string;
    challenging_thing: string;
    learned_thing: string;
    user_selected_date: string;
  } | null>(null);

  const journalsUrl =
    import.meta.env.VITE_BASE_API_URL + `journal-entries/${id}`;

  useEffect(() => {
    const fetchJournalEntry = async () => {
      console.log('IN FETCH JOURNAL ENTRY USEEFFECT');
      try {
        const response = await fetch(journalsUrl, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('ID', id);
        if (response.ok) {
          const data = await response.json();
          setJournalEntry(data);
        } else {
          console.error('Failed to fetch journal entry');
        }
      } catch (error) {
        console.error('Error fetching journal entry:', error);
      }
    };

    fetchJournalEntry();
  }, [id, journalsUrl]);

  console.log('journalENTRY', journalEntry);

  return (
    <div>
      <h2>
        Journal Entry for{' '}
        {journalEntry
          ? formatSelectedDate(journalEntry.user_selected_date)
          : ''}
      </h2>
      {journalEntry && (
        <>
          <p>Good thing: {journalEntry.good_thing}</p>
          <p>Challenging thing: {journalEntry.challenging_thing}</p>
          <p>Learned thing: {journalEntry.learned_thing}</p>
        </>
      )}
    </div>
  );
};

export default JournalsPage;
