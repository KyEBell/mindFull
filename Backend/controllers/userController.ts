import { Request, Response, NextFunction } from 'express';
import createPool from '../config/db';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('getting all users');
    const dbPool = await createPool();
    const [rows] = await dbPool.execute('SELECT * FROM users');
    res.locals.allUsers = rows;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Cannot find users' });
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('entered into getUserById');
    const userId = req.params.id;
    const dbPool = await createPool();
    const [rows] = await dbPool.execute('SELECT * FROM users WHERE id = ?', [
      userId,
    ]);
    if (!Array.isArray(rows)) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.locals.user = rows;
      return next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UserController = { getAllUsers, getUserById };
