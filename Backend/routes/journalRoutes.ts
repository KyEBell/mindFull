import express, { Request, Response } from 'express';
import { JournalEntryController } from '../controllers/journalEntryController';
import { authenticateToken } from '../middleware/authentication';

const router = express.Router();

// Define journal entry routes
router.get(
  '/',
  authenticateToken,
  JournalEntryController.getAllJournalEntries,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.allEntries);
  }
);
//getJournalEntry by ID
router.get(
  '/:id',
  authenticateToken,
  JournalEntryController.getJournalEntryById,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.journalEntry);
  }
);

//Add journal Entry

router.post(
  '/',
  authenticateToken,
  JournalEntryController.addJournalEntry,
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.newJournalEntry);
  }
);
//EDIT journal entry

router.put(
  '/:id',
  authenticateToken,
  JournalEntryController.editJournalEntry,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.updatedEntry);
  }
);
//DELETE journal entry
router.delete(
  '/:id',
  JournalEntryController.deleteJournalEntry,
  (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Journal successfully deleted' });
  }
);

export default router;
