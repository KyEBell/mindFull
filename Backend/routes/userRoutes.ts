import express, { Response } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/authentication';
import { ExtendedRequest } from '../types';

const router = express.Router();
router.use(authenticateToken);

//defining user routes

//ROUTE HERE AS A TEST PLACEHOLDER, WILL NOT NEED TO GET ALL USERS IN FINAL APP
router.get(
  '/',
  UserController.getAllUsers,
  (req: ExtendedRequest, res: Response) => {
    const authenticatedUserId = req.user?.id;

    return res.status(200).json(res.locals.allUsers);
  }
);

//GET method for user to get their info
router.get(
  '/:id',
  UserController.getUserById,
  (req: ExtendedRequest, res: Response) => {
    const authenticatedUserId = req.user?.id;

    return res.status(200).json(res.locals.user);
  }
);

//route for user to edit their info
router.put(
  '/:id',
  UserController.editUser,
  (req: ExtendedRequest, res: Response) => {
    const authenticatedUserId = req.user?.id;

    return res.status(200).json({ message: 'User edit successful' });
  }
);

//route for user to delete their account
router.delete(
  '/:id',
  UserController.deleteUser,
  (req: ExtendedRequest, res: Response) => {
    const authenticatedUserId = req.user?.id;

    return res.status(204).json({ message: 'user successfully deleted' });
  }
);

export default router;
