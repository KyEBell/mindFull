import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../styles/WriteJournalPage.module.css';

interface EditJournalEntryFormProps {
  initialValues: {
    good_thing: string;
    challenging_thing: string;
    learned_thing: string;
    user_selected_date: string;
  };
  onSubmit: (values: {
    good_thing: string;
    challenging_thing: string;
    learned_thing: string;
    user_selected_date: string;
  }) => void;
}

const EditJournalEntryForm: React.FC<EditJournalEntryFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const [editedGoodThing, setEditedGoodThing] = useState(
    initialValues.good_thing
  );
  const [editedChallengingThing, setEditedChallengingThing] = useState(
    initialValues.challenging_thing
  );
  const [editedLearnedThing, setEditedLearnedThing] = useState(
    initialValues.learned_thing
  );
  const [editedDate, setEditedDate] = useState<Date>(
    new Date(initialValues.user_selected_date)
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      good_thing: editedGoodThing,
      challenging_thing: editedChallengingThing,
      learned_thing: editedLearnedThing,
      user_selected_date: editedDate.toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleEditSubmit} className={styles.journalsContainer}>
      <label className={styles.labelContainer}>
        Good thing:
        <textarea
          className={styles.journalPageTextArea}
          value={editedGoodThing}
          onChange={(e) => setEditedGoodThing(e.target.value)}
        />
      </label>
      <label className={styles.labelContainer}>
        Challenging thing:
        <textarea
          className={styles.journalPageTextArea}
          value={editedChallengingThing}
          onChange={(e) => setEditedChallengingThing(e.target.value)}
        />
      </label>
      <label className={styles.labelContainer}>
        Learned thing:
        <textarea
          className={styles.journalPageTextArea}
          value={editedLearnedThing}
          onChange={(e) => setEditedLearnedThing(e.target.value)}
        />
      </label>
      <div className={styles.labelContainer}>
        <label>Date:</label>

        <div className={styles.datePickerContainer}>
          <DatePicker
            selected={editedDate}
            onChange={(date) => setEditedDate(date as Date)}
            value={editedDate.toISOString().split('T')[0]}
            wrapperClassName={styles.datePickerWrapper}
            dateFormat='yyyy-MM-dd'
          />
        </div>
      </div>
      <button type='submit' className={styles.submitButton}>
        Update Entry
      </button>
    </form>
  );
};

export default EditJournalEntryForm;
