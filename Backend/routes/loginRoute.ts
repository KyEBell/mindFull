import express, { Request, Response } from 'express';
import { UserLoginController } from '../controllers/UserLoginController';

const router = express.Router();

// Endpoint for user login
router.post(
  '/',
  UserLoginController.userLogin,
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
    const user = res.locals.user;
    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, refreshCookieOptions)
      .json({
        message: 'Successful login',
        accessToken,
        refreshToken,
        user,
      });
  }
);

export default router;
