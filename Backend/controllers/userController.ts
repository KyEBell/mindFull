import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import createPool from '../config/db';

//controller to get all users ==================================================================>
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbPool = await createPool();
    const [rows] = await dbPool.execute('SELECT * FROM users');
    res.locals.allUsers = rows;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Cannot find users' });
  }
};

//contoller to get userby ID =======================================================================>
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

//=======================Creating a user controller ==============================================>

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const dbPool = await createPool();

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const UserController = { getAllUsers, getUserById, createUser };
