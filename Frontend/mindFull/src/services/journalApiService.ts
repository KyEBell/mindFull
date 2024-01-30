const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export interface JournalEntry {
  id: number | undefined;
  user_id: number | undefined;
  good_thing: string | null;
  challenging_thing: string | null;
  learned_thing: string | null;
  entry_date: Date;
  user_selected_date: string | Date;
}

const updateJournalEntry = async (
  // id: string,
  // userId: string,
  data: JournalEntry
): Promise<boolean> => {
  console.log('request payload', data);

  try {
    const response = await fetch(`${BASE_URL}journal-entries/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Failed to update journal entry');
      return false;
    }
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }
};

export { updateJournalEntry };
