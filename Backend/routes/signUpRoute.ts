import express, { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { validateUserInput } from '../middleware/validateUserFunction';

const router = express.Router();

//route for user to create account
router.post(
  '/',
  validateUserInput,
  UserController.createUser,
  (req: Request, res: Response) => {
    const accessToken = res.locals.accessToken;
    const refreshToken = res.locals.refreshToken;
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    };
    const refreshCookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 10800000),
    };
    return res
      .status(201)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, refreshCookieOptions)
      .json({
        message: 'user successfully created',
        accessToken,
        refreshToken,
      });
  }
);

export default router;
