import React from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../styles/WriteJournalPage.module.css';
interface JournalForm {
  good_thing: string;
  challenging_thing: string;
  learned_thing: string;
  user_selected_date?: Date;
}

const WriteJournalPage: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<JournalForm>();
  const writeJournalUrl = import.meta.env.VITE_BASE_API_URL + 'journal-entries';

  const handleSubmission = handleSubmit(async (data: JournalForm) => {
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
      } else {
        console.error('failed to add journal', await response.text());
      }
    } catch (error) {
      console.log('Error adding journal entry', error);
    }
  });

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
              onChange={(e) => setValue('good_thing', e.target.value)}
            />
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label>
            Something challenging that happened today:
            <textarea
              className={styles.journalPageTextArea}
              {...register('challenging_thing')}
              onChange={(e) => setValue('challenging_thing', e.target.value)}
            />
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label>
            Something that I learned today:
            <textarea
              className={styles.journalPageTextArea}
              {...register('learned_thing')}
              onChange={(e) => setValue('learned_thing', e.target.value)}
            />
          </label>
        </div>
        <button type='submit' className={styles.submitButton}>
          Submit
        </button>
      </form>
    </>
  );
};

export default WriteJournalPage;
