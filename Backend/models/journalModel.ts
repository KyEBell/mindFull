export interface JournalEntry {
  id: number;
  user_id: number;
  good_thing: string | null;
  challenging_thing: string | null;
  learned_thing: string | null;
  entry_date?: Date;
  user_selected_date: Date;
}

export interface DatabaseJournalEntry {
  id: number;
  user_id: number;
  good_thing: string;
  challenging_thing: string;
  learned_thing: string;
  iv_good_thing: string;
  iv_challenging_thing: string;
  iv_learned_thing: string;
}
