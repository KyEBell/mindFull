import express, { Request, Response } from 'express';
import { UserLoginController } from '../controllers/UserLoginController';

const router = express.Router();

// Endpoint for user login
router.post(
  '/',
  UserLoginController.userLogin,
  (req: Request, res: Response) => {
    if (res) {
      console.log(res);
    }
    const accessToken = res.locals.accessToken;
    const refreshToken = res.locals.refreshToken;
    return res
      .status(200)
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .json({
        message: 'Successful login',
        accessToken,
        refreshToken,
      });
  }
);

export default router;
