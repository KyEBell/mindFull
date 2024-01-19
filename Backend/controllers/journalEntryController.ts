import { Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { encryptionUtils } from '../utils/encryption';
import { JournalEntry } from '../models/journalModel';
import { ExtendedRequest } from '../types';
import crypto from 'crypto';

//encryptionKey
const eKey = encryptionUtils.getEncryptionKey();

//database journal entry interface
interface DatabaseJournalEntry {
  id: number;
  user_id: number;
  good_thing: string;
  challenging_thing: string;
  learned_thing: string;
  iv_good_thing: string;
  iv_challenging_thing: string;
  iv_learned_thing: string;
}

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

//GET ALL JOURNAL ENTRIES===================================================================>
const getAllJournalEntries = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
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
      return res.status(404).json({ error: 'Journal Entry Not Found' });
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
    const newJournalEntry: JournalEntry = {
      id: 0,
      user_id: userId!,
      good_thing: encryptGT,
      challenging_thing: encryptCT,
      learned_thing: encryptLT,
      user_selected_date: new Date(user_selected_date),
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
    const journalEntryId = req.params.id;
    const [entryToEdit] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [journalEntryId, userId]
    );

    if (entryToEdit.length < 1) {
      return res.status(404).json({ error: 'Journal Entry Not Found' });
    }

    // Keeping code here in the event decryption is needed for proper functionality.
    // const existingEntry = entryToEdit[0];
    // const existingIVGT = Buffer.from(existingEntry.iv_good_thing, 'hex');
    // const existingIVCT = Buffer.from(existingEntry.iv_challenging_thing, 'hex');
    // const existingIVLT = Buffer.from(existingEntry.iv_learned_thing, 'hex');
    // const decryptedGT = encryptionUtils.decryptData(
    //   existingEntry.good_thing,
    //   eKey,
    //   existingIVGT
    // );
    // const decryptedCT = encryptionUtils.decryptData(
    //   existingEntry.challenging_thing,
    //   eKey,
    //   existingIVCT
    // );
    // const decryptedLT = encryptionUtils.decryptData(
    //   existingEntry.learned_thing,
    //   eKey,
    //   existingIVLT
    // );

    const { good_thing, challenging_thing, learned_thing } = req.body;

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
      'UPDATE journal_entries SET good_thing = ?, challenging_thing = ?, learned_thing = ?, iv_good_thing = ?, iv_challenging_thing = ?, iv_learned_thing = ? WHERE id = ?',
      [
        encryptGT,
        encryptCT,
        encryptLT,
        newIVGT.toString('hex'),
        newIVCT.toString('hex'),
        newIVLT.toString('hex'),
        journalEntryId,
      ]
    );
    const [updatedEntry] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE id= ?',
      [journalEntryId]
    );
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
};
