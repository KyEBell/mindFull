const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export interface JournalEntry {
  id: number;
  user_id: number;
  good_thing: string | null;
  challenging_thing: string | null;
  learned_thing: string | null;
  entry_date: Date;
  user_selected_date: string;
}

const updateJournalEntry = async (
  id: string,
  userId: string,
  data: JournalEntry
): Promise<boolean> => {
  console.log('request payload', data);

  //   const formattedData = {
  //     ...data,
  //     user_selected_date: data.user_selected_date?.toISOString(),
  //   };
  try {
    const response = await fetch(`${BASE_URL}journal-entries/${id}`, {
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
