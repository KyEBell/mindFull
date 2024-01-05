import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserInput } from '../middleware/validateUserFunction';
import { authenticateToken } from '../middleware/authentication';

const router = express.Router();

router.post(
  '/',
  validateUserInput,
  UserController.createUser,
  authenticateToken,
  (req: Request, res: Response) => {
    return res.status(201).json({ message: 'user successfully created' });
  }
);

export default router;
