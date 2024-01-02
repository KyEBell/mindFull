import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserInput } from '../middleware/userControllerMiddleware';

const router = express.Router();

//defining user routes
//ROUTE HERE AS A TEST PLACEHOLDER, WILL NOT NEED TO GET ALL USERS IN FINAL APP
router.get('/', UserController.getAllUsers, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.allUsers);
});

//Route here can probably be deleted later on.
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

export default router;
