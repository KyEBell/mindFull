import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authentication';
import { RefreshTokenController } from '../controllers/RefreshTokenController';

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/refresh',
  RefreshTokenController.refresh,
  (req: Request, res: Response) => {
    return res.status(200).json({ accessToken: req.cookies.accessToken });
  }
);

export default router;
