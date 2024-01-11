import express, { Response } from 'express';
import { authenticateToken } from '../middleware/authentication';
import { ExtendedRequest } from '../types';
import { UserLogoutController } from '../controllers/UserLogoutController';

const router = express.Router();
router.use(authenticateToken);

router.post(
  '/',
  UserLogoutController.userLogout,
  (req: ExtendedRequest, res: Response) => {
    return res.status(200).json({ message: 'User Successfully logged out' });
  }
);

export default router;
