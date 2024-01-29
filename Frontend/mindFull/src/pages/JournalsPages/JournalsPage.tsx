import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatSelectedDate } from '../../utilities/dateFormat';
import EditJournalEntryForm from '../../components/EditJournalEntryForm';
import { updateJournalEntry } from '../../services/journalApiService';
import useAuth from '../../hooks/useAuth';
import isEqual from 'lodash/isEqual';
import { JournalEntry } from '../../services/journalApiService';

const JournalsPage: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedValues, setEditedValues] = useState<{
    good_thing: string;
    challenging_thing: string;
    learned_thing: string;
    user_selected_date: string;
  }>({
    good_thing: '',
    challenging_thing: '',
    learned_thing: '',
    user_selected_date: '',
  });
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // const [journalEntry, setJournalEntry] = useState<{
  //   id: number;
  //   user_id: number;
  //   good_thing: string;
  //   challenging_thing: string;
  //   learned_thing: string;
  //   user_selected_date: string;
  // } | null>(null);
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);

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
          console.log('RESPONSE OK');
          const data = await response.json();
          setJournalEntry((prevJournalEntry) => {
            console.log('prevJournalEntry:', prevJournalEntry);
            console.log('data:', data);

            // Update only if the fetched data is different
            if (!isEqual(prevJournalEntry, data)) {
              console.log('is not equal is hitting ');
              return {
                ...data,
                entry_date: new Date(
                  data.user_selected_date
                ).toLocaleDateString('en-US'),
              };
            }

            console.log('returning prevJournalEntry');
            return prevJournalEntry;
          });
        } else {
          if (response.status === 401) {
            console.error('unauthorized');
            navigate('/login');
          } else {
            console.error('failed to fetch journal entry');
          }
        }
      } catch (error) {
        console.error('Error fetching journal entry:', error);
      }
    };

    fetchJournalEntry();
  }, [id, journalsUrl, navigate]);

  if (!user) {
    return null;
  }
  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    setEditedValues(
      (prevEditedValues) =>
        ({
          ...prevEditedValues,
          good_thing: journalEntry?.good_thing || '',
          challenging_thing: journalEntry?.challenging_thing || '',
          learned_thing: journalEntry?.learned_thing || '',
          user_selected_date: journalEntry?.user_selected_date || '',
        } as {
          good_thing: string;
          challenging_thing: string;
          learned_thing: string;
          user_selected_date: string;
        })
    );
    setEditMode(true);
  };

  const handleEditSubmit = async (editedValues: {
    good_thing: string;
    challenging_thing: string;
    learned_thing: string;
    user_selected_date: string;
  }) => {
    if (!journalEntry) {
      console.error('Journal entry is null');
      return;
    }
    const { user_selected_date, ...rest } = editedValues;

    let formattedDate: string;
    const isDate = (value: string | Date): value is Date =>
      value instanceof Date;

    if (isDate(user_selected_date)) {
      formattedDate = user_selected_date.toISOString().split('T')[0];
    } else {
      formattedDate = new Date(user_selected_date).toLocaleDateString('en-US');
    }
    if (!id) {
      console.error('Journal entry id is undefined');
      return;
    }
    const success = await updateJournalEntry(id, user.id, {
      id: journalEntry.id,
      user_id: journalEntry.user_id,
      entry_date: journalEntry.entry_date,
      user_selected_date: formattedDate,
      ...rest,
    });

    if (success) {
      setJournalEntry((prevJournalEntry) => ({
        ...prevJournalEntry,
        ...editedValues,
        entry_date: formattedDate,
      }));
      setEditMode(false);
    }
  };
  return (
    <div>
      <h2>
        Journal Entry for{' '}
        {journalEntry
          ? formatSelectedDate(journalEntry.user_selected_date)
          : ''}
      </h2>
      {journalEntry &&
        (editMode ? (
          <EditJournalEntryForm
            initialValues={editedValues}
            onSubmit={handleEditSubmit}
          />
        ) : (
          <>
            <p>Good thing: {journalEntry.good_thing}</p>
            <p>Challenging thing: {journalEntry.challenging_thing}</p>
            <p>Learned thing: {journalEntry.learned_thing}</p>
            <button onClick={(event) => handleButtonClick(event)}>
              Edit Entry
            </button>
          </>
        ))}
    </div>
  );
};

export default JournalsPage;
