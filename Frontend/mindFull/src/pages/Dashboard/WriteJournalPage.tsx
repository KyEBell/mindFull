import React from 'react';
import { useForm } from 'react-hook-form';

interface JournalForm {
  good_thing: string;
  challenging_thing: string;
  learned_thing: string;
  user_selected_date?: Date;
}

const WriteJournalPage: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<JournalForm>();
  const writeJournalUrl = import.meta.env.VITE_BASE_API_URL + 'journal-entries';
  console.log(writeJournalUrl);

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
    <div>
      <div>WriteJournalPage should render here.</div>

      <h2>Write Today's Journal</h2>
      <form onSubmit={handleSubmission}>
        <label>
          Something good that happened today:
          <textarea
            {...register('good_thing')}
            onChange={(e) => setValue('good_thing', e.target.value)}
          />
        </label>
        <label>
          Something challenging that happened today:
          <textarea
            {...register('challenging_thing')}
            onChange={(e) => setValue('challenging_thing', e.target.value)}
          />
        </label>
        <label>
          Something that I learned today:
          <textarea
            {...register('learned_thing')}
            onChange={(e) => setValue('learned_thing', e.target.value)}
          />
        </label>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default WriteJournalPage;
