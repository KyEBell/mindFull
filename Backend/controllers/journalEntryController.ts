import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';

interface ExtendedRequest extends Request {
  user?: import('../models/userModel').User;
}

//GET ALL JOURNAL ENTRIES
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

const getJournalEntryById = async (req: Request, res: Response) => {};

export const JournalEntryController = {
  getAllJournalEntries,
  getJournalEntryById,
};
