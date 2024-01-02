import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';

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
    let { username, email, password } = req.body;

    if (
      username.includes(' ') ||
      email.includes(' ') ||
      password.includes(' ')
    ) {
      return res.status(400).json({
        error: 'Spaces are not allowed in username, email, or password',
      });
    }
    //.replace for data integrity
    const sanitizedUsername = username.replace(/\s/g, '');
    const sanitizedEmail = email.replace(/\s/g, '');
    const sanitizedPassword = password.replace(/\s/g, '');

    const dbPool = await createPool();

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    const newUser: User = {
      id: 0,
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    };

    await dbPool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [newUser.username, newUser.email, newUser.password]
    );
    return next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const UserController = { getAllUsers, getUserById, createUser };
