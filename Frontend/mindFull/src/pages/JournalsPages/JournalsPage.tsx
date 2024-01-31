import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatSelectedDate } from '../../utilities/dateFormat';
import EditJournalEntryForm from '../../components/EditJournalEntryForm';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import {
  JournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../../services/journalApiService';
import useAuth from '../../hooks/useAuth';
import SuccessModal from '../../components/SuccessModal';
const JournalsPage: React.FC = () => {
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
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
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const journalsUrl =
    import.meta.env.VITE_BASE_API_URL + `journal-entries/${id}`;

  const returnToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchJournalEntry = async () => {
      try {
        const response = await fetch(journalsUrl, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setJournalEntry(() => {
            return {
              ...data,
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
  const handleEditButtonClick: React.MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
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

    if (!id) {
      console.error('Journal entry id is undefined');
      return;
    }

    const success = await updateJournalEntry({
      id: journalEntry.id,
      user_id: journalEntry.user_id,
      user_selected_date: user_selected_date,
      ...rest,
    });

    if (success) {
      setJournalEntry((prevJournalEntry: JournalEntry | null) => {
        if (prevJournalEntry) {
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

  const handleDeleteButtonClick = () => {
    setShowConfirmationModal(true);
  };
  const handleConfirmDelete = async () => {
    if (journalEntry && id) {
      console.log('JOURNAL ENTRY', journalEntry, 'ID', id);
      const success = await deleteJournalEntry(id);
      if (success) {
        setShowConfirmationModal(false);

        setShowSuccessModal(true);
      }
    }
  };

  const handleCancelDelete = () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);
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
            <button onClick={(event) => handleEditButtonClick(event)}>
              Edit Entry
            </button>
            <button onClick={handleDeleteButtonClick}>Delete Entry</button>
            {showConfirmationModal && (
              <ConfirmDeleteModal
                message='Are you sure you want to delete this journal entry?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
              />
            )}
            {showSuccessModal && (
              <SuccessModal
                message='Journal entry deleted successfully'
                returnToDashboard={returnToDashboard}
              />
            )}
          </>
        ))}
    </div>
  );
};

export default JournalsPage;
