import { Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { encryptionUtils } from '../utils/encryption';
import { JournalEntry, DatabaseJournalEntry } from '../models/journalModel';
import { ExtendedRequest } from '../types';
import crypto from 'crypto';

//encryptionKey
const eKey = encryptionUtils.getEncryptionKey();

const mapRowToDatabaseEntry = (row: RowDataPacket): DatabaseJournalEntry => {
  return {
    id: row.id,
    user_id: row.user_id,
    good_thing: row.good_thing,
    challenging_thing: row.challenging_thing,
    learned_thing: row.learned_thing,
    iv_good_thing: row.iv_good_thing,
    iv_challenging_thing: row.iv_challenging_thing,
    iv_learned_thing: row.iv_learned_thing,
  };
};
//DISPLAY ALL JOURNAL ENTRIES BY DATE===================================================================>
const getJournalDates = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('in the getJournalDates controller function');
    const userId = req.user?.id;
    const { date } = req.params;
    console.log('date from controller', date);

    if (date) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM journal_entries WHERE user_id = ? AND user_selected_date = ?',
        [userId, date]
      );

      res.locals.allDates = rows;
    } else {
      // console.log('USER ID FROM JOURNAL DATES', req.user);
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT DISTINCT user_selected_date, id FROM journal_entries WHERE user_id = ?',
        [userId]
      );

      if (!rows || !Array.isArray(rows)) {
        throw new Error('Invalid response from the database');
      }
      // console.log('ROWS', rows);
      const allDates = rows.map((row) => ({
        id: row.id,
        user_selected_date: row.user_selected_date,
      }));
      // console.log('allDates from journalEntryconroller', allDates);
      res.locals.allDates = allDates;
      // console.log('allDates', allDates);
    }
    return next();
  } catch (err) {
    console.log('Error fetching journal dates', err);
    res.status(500).json({
      error: 'Internal Server Error in Get All Journal Dates Controller',
    });
  }
};
//GET ALL JOURNAL ENTRIES===================================================================>
const getAllJournalEntries = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    console.log(userId, 'USER from get all journal entries');
    console.log('username from get all journal entries', req.user?.username);
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE user_id = ?',
      [userId]
    );

    if (!rows || !Array.isArray(rows)) {
      throw new Error('Invalid response from the database');
    }

    //code do decrypt entries from the DB
    const decryptedEntries = rows.map((entry: RowDataPacket) => {
      const databaseEntry = mapRowToDatabaseEntry(entry);
      const decryptedEntry = {
        ...databaseEntry,
        good_thing: encryptionUtils.decryptData(
          entry.good_thing,
          eKey,
          Buffer.from(entry.iv_good_thing, 'hex')
        ),
        challenging_thing: encryptionUtils.decryptData(
          entry.challenging_thing,
          eKey,
          Buffer.from(entry.iv_challenging_thing, 'hex')
        ),
        learned_thing: encryptionUtils.decryptData(
          entry.learned_thing,
          eKey,
          Buffer.from(entry.iv_learned_thing, 'hex')
        ),
      };
      return decryptedEntry;
    });

    res.locals.allEntries = decryptedEntries;
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
    if (!journalEntry || journalEntry.length < 1) {
      return res.status(401).json({ error: 'Journal Entry By Id Not Found' });
    }

    const entry = journalEntry[0];

    const decryptedEntry = {
      ...entry,
      good_thing: encryptionUtils.decryptData(
        entry.good_thing,
        eKey,
        Buffer.from(entry.iv_good_thing, 'hex')
      ),
      challenging_thing: encryptionUtils.decryptData(
        entry.challenging_thing,
        eKey,
        Buffer.from(entry.iv_challenging_thing, 'hex')
      ),
      learned_thing: encryptionUtils.decryptData(
        entry.learned_thing,
        eKey,
        Buffer.from(entry.iv_learned_thing, 'hex')
      ),
    };
    res.locals.journalEntry = decryptedEntry;
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

    // console.log('user_d', userId, 'userselecteddate', user_selected_date);

    // const [existingEntry] = await pool.execute<RowDataPacket[]>(
    //   'SELECT id FROM journal_entries WHERE user_id = ? AND user_selected_date = ?',
    //   [userId, user_selected_date]
    // );

    // console.log(existingEntry, 'existingEntry');
    // if (existingEntry && existingEntry.length > 0) {
    //   return res.status(400).json({
    //     error: 'Journal entry already exists for this date.',
    //   });
    // }

    const ivGT = crypto.randomBytes(16);
    const ivCT = crypto.randomBytes(16);
    const ivLT = crypto.randomBytes(16);

    const encryptGT = encryptionUtils.encryptData(good_thing, eKey, ivGT);
    const encryptCT = encryptionUtils.encryptData(
      challenging_thing,
      eKey,
      ivCT
    );
    const encryptLT = encryptionUtils.encryptData(learned_thing, eKey, ivLT);
    const user_selected_dateString =
      user_selected_date || new Date().toISOString(); // Use the current date if user_selected_date is not provided
    const user_selected_dateValue = new Date(user_selected_dateString);

    const newJournalEntry: JournalEntry = {
      id: 0,
      user_id: userId!,
      good_thing: encryptGT,
      challenging_thing: encryptCT,
      learned_thing: encryptLT,
      user_selected_date: user_selected_dateValue,
    };

    const [newJournalEntryArray] = await pool.execute<ResultSetHeader>(
      'INSERT INTO journal_entries(user_id, good_thing, challenging_thing, learned_thing, user_selected_date, iv_good_thing, iv_challenging_thing, iv_learned_thing) VALUES (?,?,?,?,?,?,?,?)',
      [
        newJournalEntry.user_id,
        newJournalEntry.good_thing,
        newJournalEntry.challenging_thing,
        newJournalEntry.learned_thing,
        newJournalEntry.user_selected_date,
        ivGT.toString('hex'),
        ivCT.toString('hex'),
        ivLT.toString('hex'),
      ]
    );

    const newJournalEntryId = (newJournalEntryArray as ResultSetHeader)
      .insertId;
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
    console.log('in the edit jouranlEntryController - userId', userId);

    const journalEntryId = req.params.id;
    const [entryToEdit] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [journalEntryId, userId]
    );

    // console.log('entry to edit', entryToEdit);
    if (entryToEdit.length < 1) {
      return res.status(404).json({ error: 'Journal Entry Not Found' });
    }

    const { good_thing, challenging_thing, learned_thing, user_selected_date } =
      req.body;

    console.log('req.body', req.body);
    console.log('good thing', good_thing);

    const newIVGT = crypto.randomBytes(16);
    const newIVCT = crypto.randomBytes(16);
    const newIVLT = crypto.randomBytes(16);

    const encryptGT = encryptionUtils.encryptData(good_thing, eKey, newIVGT);
    const encryptCT = encryptionUtils.encryptData(
      challenging_thing,
      eKey,
      newIVCT
    );
    const encryptLT = encryptionUtils.encryptData(learned_thing, eKey, newIVLT);
    await pool.execute(
      'UPDATE journal_entries SET good_thing = ?, challenging_thing = ?, learned_thing = ?, iv_good_thing = ?, iv_challenging_thing = ?, iv_learned_thing = ?, user_selected_date = ? WHERE id = ?',
      [
        encryptGT,
        encryptCT,
        encryptLT,
        newIVGT.toString('hex'),
        newIVCT.toString('hex'),
        newIVLT.toString('hex'),
        user_selected_date,
        journalEntryId,
      ]
    );
    const [updatedEntry] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id= ?',
      [journalEntryId]
    );
    console.log('updated entry', updatedEntry);
    res.locals.updatedEntry = updatedEntry[0];
    return next();
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
  getJournalDates,
};
