import express, { Response } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/authentication';
import { ExtendedRequest } from '../types';

const router = express.Router();
router.use(authenticateToken);

router.post('/', (req: ExtendedRequest, res: Response) => {
  console.log('Cleared accessToken cookie:', req.cookies.accessToken);
  console.log('Cleared refreshToken cookie:', req.cookies.refreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  console.log('Cleared accessToken cookie:', req.cookies.accessToken);
  console.log('Cleared refreshToken cookie:', req.cookies.refreshToken);
  return res.status(200).json({ message: 'User Successfully logged out' });
});

export default router;
