import express, { Request, Response, NextFunction } from 'express';
import { JournalEntryController } from '../controllers/journalEntryController';
import { authenticateToken } from '../middleware/authentication';

const router = express.Router();
router.use(authenticateToken);

// Define journal entry routes
router.get(
  '/',
  JournalEntryController.getAllJournalEntries,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.allEntries);
  }
);
router.get('/journal-entries/:id', JournalEntryController.getJournalEntryById);
// Add other routes as needed

export default router;
