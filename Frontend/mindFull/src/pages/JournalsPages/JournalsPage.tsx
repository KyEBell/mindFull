import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatSelectedDate } from '../../utilities/dateFormat';
import EditJournalEntryForm from '../../components/EditJournalEntryForm';
import { updateJournalEntry } from '../../services/journalApiService';
import useAuth from '../../hooks/useAuth';
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
        if (response.ok) {
          const data = await response.json();
          setJournalEntry((prevJournalEntry) => {
            console.log('prevJournalEntry:', prevJournalEntry);
            console.log('data:', data);
            return {
              ...data,
              entry_date: new Date(data.user_selected_date).toISOString(),
            };
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
  }, [id, journalsUrl, navigate, editMode]);

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
    user_selected_date: string | Date;
  }) => {
    if (!journalEntry) {
      console.error('Journal entry is null');
      return;
    }
    const { user_selected_date, ...rest } = editedValues;
    // console.log('USER SELECTED DATE', user_selected_date);
    // const formattedDate =
    //   typeof user_selected_date === 'string'
    //     ? (user_selected_date as string)
    //     : (user_selected_date as Date).toISOString().split('T')[0];

    // console.log('formattedDate', formattedDate);

    if (!id) {
      console.error('Journal entry id is undefined');
      return;
    }

    const success = await updateJournalEntry({
      id: journalEntry.id,
      user_id: journalEntry.user_id,
      entry_date: journalEntry.entry_date,
      user_selected_date: user_selected_date,
      ...rest,
    });

    if (success) {
      setJournalEntry((prevJournalEntry: JournalEntry | null) => {
        if (prevJournalEntry) {
          console.log('previous journal entry is truthy');
          return {
            ...prevJournalEntry,
            ...editedValues,
            user_selected_date: user_selected_date,
          };
        } else {
          return prevJournalEntry;
        }
      });
      setEditMode(false);
    }
  };

  console.log('JOURNAL ENTRY', journalEntry);
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
