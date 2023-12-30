import express from 'express';
import { JournalEntryController } from '../controllers/journalEntryController';

const router = express.Router();

// Define journal entry routes
router.get('/journal-entries', JournalEntryController.getAllJournalEntries);
router.get('/journal-entries/:id', JournalEntryController.getJournalEntryById);
// Add other routes as needed

export default router;
