import express, { Request, Response } from 'express';
import { UserLoginController } from '../controllers/userLoginController';
import { authenticateToken } from '../middleware/authentication';

const router = express.Router();

// Endpoint for user login
router.post(
  '/login',
  UserLoginController.userLogin,
  authenticateToken,
  (req: Request, res: Response) => {
    return res.status(200).json({
      accessToken: req.cookies['accessToken'],
      refreshToken: req.cookies['refreshToken'],

      message: 'Successful login',
    });
  }
);

export default router;
