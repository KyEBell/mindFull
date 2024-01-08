import express, { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { validateUserInput } from '../middleware/validateUserFunction';
import { authenticateToken } from '../middleware/authentication';
import { ExtendedRequest } from '../types';

const router = express.Router();

//route for user to create account
router.post(
  '/',
  validateUserInput,
  UserController.createUser,
  authenticateToken,
  (req: ExtendedRequest, res: Response) => {
    const accessToken = req.cookies.accessToken;
    return res
      .status(201)
      .json({ message: 'user successfully created', accessToken });
  }
);

export default router;
