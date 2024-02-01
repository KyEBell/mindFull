import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import SuccessModal from '../../components/SuccessModal';
import 'react-datepicker/dist/react-datepicker.css';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/WriteJournalPage.module.css';
interface JournalForm {
  good_thing: string;
  challenging_thing: string;
  learned_thing: string;
  user_selected_date?: Date | null;
}

const WriteJournalPage: React.FC = () => {
  const { register, handleSubmit, getValues } = useForm<JournalForm>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const writeJournalUrl = import.meta.env.VITE_BASE_API_URL + 'journal-entries';

  const navigate = useNavigate();
  const handleSubmission = handleSubmit(async (data: JournalForm) => {
    data.user_selected_date = selectedDate;
    try {
      const response = await fetch(writeJournalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Journal Entry Added Successfully');
        setShowSuccessModal(true);
      } else {
        console.error('failed to add journal', await response.text());
      }
    } catch (error) {
      console.log('Error adding journal entry', error);
    }
  });

  const returnToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <>
      <h2>Write Today's Journal</h2>
      <form onSubmit={handleSubmission} className={styles.journalsContainer}>
        <div className={styles.labelContainer}>
          <label>
            Something good that happened today:
            <textarea
              className={styles.journalPageTextArea}
              {...register('good_thing')}
            />
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label>
            Something challenging that happened today:
            <textarea
              className={styles.journalPageTextArea}
              {...register('challenging_thing')}
            />
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label>
            Something that I learned today:
            <textarea
              className={styles.journalPageTextArea}
              {...register('learned_thing')}
            />
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label>Date:</label>

          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={selectedDate}
              value={getValues('user_selected_date')
                ?.toISOString()
                .slice(0, 10)}
              dateFormat='yyyy-MM-dd'
              wrapperClassName={styles.datePickerWrapper}
              className={styles.datePicker}
              onChange={(date: Date) => setSelectedDate(date)}
            />
          </div>
        </div>

        <button type='submit' className={styles.submitButton}>
          Submit
        </button>
      </form>
      {showSuccessModal && (
        <SuccessModal
          returnToDashboard={returnToDashboard}
          message='Journal entry added successfully!'
        />
      )}
    </>
  );
};

export default WriteJournalPage;
