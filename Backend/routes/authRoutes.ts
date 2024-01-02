import express, { Request, Response } from 'express';
import { UserLoginController } from '../controllers/userLoginController';

const router = express.Router();

// Endpoint for user login
router.post(
  '/login',
  UserLoginController.userLogin,
  (req: Request, res: Response) => {
    return res.status(200).json({
      accessToken: res.locals.accessToken,
      refreshToken: res.locals.refreshToken,
      message: 'Successful login',
    });
  }
);

export default router;
