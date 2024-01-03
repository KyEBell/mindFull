import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserInput } from '../middleware/validateUserFunction';

const router = express.Router();

//defining user routes
//ROUTE HERE AS A TEST PLACEHOLDER, WILL NOT NEED TO GET ALL USERS IN FINAL APP
router.get('/', UserController.getAllUsers, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.allUsers);
});

router.get(
  '/:id',
  UserController.getUserById,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.user);
  }
);

router.post(
  '/',
  validateUserInput,
  UserController.createUser,
  (req: Request, res: Response) => {
    return res.status(201).json({ message: 'user successfully created' });
  }
);

router.put('/:id', UserController.editUser, (req: Request, res: Response) => {
  return res.status(200).json({ message: 'User edit successful' });
});

router.delete(
  '/:id',
  UserController.deleteUser,
  (req: Request, res: Response) => {
    return res.status(204).json({ message: 'user successfully deleted' });
  }
);

export default router;
