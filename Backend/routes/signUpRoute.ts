import express, { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { validateUserInput } from '../middleware/validateUserFunction';
import { access } from 'fs';

const router = express.Router();

//route for user to create account
router.post(
  '/',
  validateUserInput,
  UserController.createUser,
  (req: Request, res: Response) => {
    const accessToken = res.locals.accessToken;
    const refreshToken = res.locals.refreshToken;
    console.log('ACCTOKEN', accessToken, 'REFRESH', refreshToken);
    return res
      .status(201)
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .json({
        message: 'user successfully created',
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  }
);

export default router;
