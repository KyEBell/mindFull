import React, { useState } from 'react';
import DatePicker from 'react-calendar';

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
  const [editedDate, setEditedDate] = useState(
    initialValues.user_selected_date
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      good_thing: editedGoodThing,
      challenging_thing: editedChallengingThing,
      learned_thing: editedLearnedThing,
      user_selected_date: editedDate,
    });
  };

  return (
    <form onSubmit={handleEditSubmit}>
      <label>
        Good thing:
        <input
          type='text'
          value={editedGoodThing}
          onChange={(e) => setEditedGoodThing(e.target.value)}
        />
      </label>
      <label>
        Challenging thing:
        <input
          type='text'
          value={editedChallengingThing}
          onChange={(e) => setEditedChallengingThing(e.target.value)}
        />
      </label>
      <label>
        Learned thing:
        <input
          type='text'
          value={editedLearnedThing}
          onChange={(e) => setEditedLearnedThing(e.target.value)}
        />
      </label>
      <label>
        Date:
        <input
          type='text'
          value={editedDate}
          onChange={(e) => {
            const enteredDate = e.target.value;
            const formattedDate = new Date(enteredDate)
              .toISOString()
              .split('T')[0];
            setEditedDate(formattedDate);
          }}
        />
      </label>
      <button type='submit'>Update Entry</button>
    </form>
  );
};

export default EditJournalEntryForm;
