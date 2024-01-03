import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface ExtendedRequest extends Request {
  user?: import('../models/userModel').User;
}

//GET ALL JOURNAL ENTRIES===================================================================>
const getAllJournalEntries = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.execute(
      'SELECT * FROM journal_entries WHERE user_id = ?',
      [userId]
    );
    res.locals.allEntries = [rows];
    return next();
  } catch (err) {
    console.log('Error fetching journal entries', err);
    res.status(500).json({
      error: 'Internal Server Error in Get All Journal Entries Controller',
    });
  }
};

//GET JOURNAL ENTRY BY ID ------------------------------------------------------------------>

const getJournalEntryById = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const journalEntryId = req.params.id;

    const [journalEntry] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [journalEntryId, userId]
    );
    if (journalEntry.length < 1) {
      return res.status(404).json({ error: 'Journal Entry Not Found' });
    }
    res.locals.journalEntry = journalEntry[0];
    return next();
  } catch (err) {
    console.log('ERROR FETCHING JOURNAL', err);
    return res
      .status(500)
      .json({ error: 'Internal Server Error in Fetching Journal By Id' });
  }
};
//ADD JOURNAL ENTRY BY ID ------------------------------------------------------------------>

const addJournalEntry = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const { good_thing, challenging_thing, learned_thing, user_selected_date } =
      req.body;

    const [newJournalEntryArray] = await pool.execute(
      'INSERT INTO journal_entries(user_id, good_thing,challenging_thing,learned_thing, user_selected_date) VALUES (?,?,?,?,?)',
      [userId, good_thing, challenging_thing, learned_thing, user_selected_date]
    );

    const newJournalEntryId = (newJournalEntryArray as RowDataPacket[])[0]
      ?.insertId;

    const [newEntry] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id = ?',
      [newJournalEntryId]
    );

    res.locals.newJournalEntry = newEntry[0];
    return next();
  } catch (err) {
    console.log('Error adding journal entry', err);
    res.status(500).json({
      error: 'Error in Add Journal Entry Controller',
    });
  }
};

//EDIT JOURNAL ENTRY BY ID ------------------------------------------------------------------>

const editJournalEntry = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const journalEntryId = req.params.id;
    const [entryToEdit] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [journalEntryId, userId]
    );

    if (entryToEdit.length < 1) {
      return res.status(404).json({ error: 'Journal Entry Not Found' });
    }

    const { good_thing, challenging_thing, learned_thing } = req.body;

    await pool.execute(
      'UPDATE journal_entries SET good_thing = ?, challenging_thing = ? ,learned_thing = ?',
      [good_thing, challenging_thing, learned_thing]
    );
    const [updatedEntry] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id= ?',
      [journalEntryId]
    );
    res.locals.updatedEntry = updatedEntry[0];
  } catch (err) {
    console.log('Error editing journal entry', err);
    return res.status(500).json({
      error: 'Error in Edit Journal Entry Controller',
    });
  }
};

//DELETE JOURNAL ENTRY BY ID ------------------------------------------------------------------>

const deleteJournalEntry = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const journalEntryId = req.params.id;

    const [entryToDelete] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [journalEntryId, userId]
    );

    if (entryToDelete.length < 1) {
      return res.status(404).json({ error: 'Journal Entry Not Found' });
    }

    await pool.execute('DELETE FROM journal_entries WHERE id = ?', [
      journalEntryId,
    ]);
    return next();
  } catch (err) {
    console.log('Error deleting journal entry', err);
    return res.status(500).json({
      error: 'Internal Server Error in Delete Journal Entry Controller',
    });
  }
};

export const JournalEntryController = {
  getAllJournalEntries,
  getJournalEntryById,
  addJournalEntry,
  deleteJournalEntry,
  editJournalEntry,
};
