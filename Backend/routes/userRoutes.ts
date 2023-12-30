import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();

//defining user routes
//ROUTE HERE AS A TEST PLACEHOLDER, WILL NOT NEED TO GET ALL USERS IN FINAL APP
router.get('/', UserController.getAllUsers, (req: Request, res: Response) => {
  console.log('exited controller and back in routes to return all users');
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

export default router;
