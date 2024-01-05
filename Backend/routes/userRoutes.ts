import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/authentication';

const router = express.Router();
router.use(authenticateToken);

//defining user routes

//ROUTE HERE AS A TEST PLACEHOLDER, WILL NOT NEED TO GET ALL USERS IN FINAL APP
router.get('/', UserController.getAllUsers, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.allUsers);
});

//GET method for user to get their info
router.get(
  '/:id',
  UserController.getUserById,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.user);
  }
);

//route for user to edit their info
router.put('/:id', UserController.editUser, (req: Request, res: Response) => {
  return res.status(200).json({ message: 'User edit successful' });
});

//route for user to delete their account
router.delete(
  '/:id',
  UserController.deleteUser,
  (req: Request, res: Response) => {
    return res.status(204).json({ message: 'user successfully deleted' });
  }
);

export default router;
