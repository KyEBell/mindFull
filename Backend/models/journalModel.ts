export interface JournalEntry {
  id: number;
  user_id: number;
  good_thing: string | null;
  challenging_thing: string | null;
  learned_thing: string | null;
  entry_date: Date;
  user_selected_date: Date;
}
