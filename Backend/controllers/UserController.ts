import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { isValidEmailFormat } from '../utils/isValidEmail';
import { Token } from '../middleware/tokens';
import { ExtendedRequest } from '../types';
//=======================Creating a user controller ==============================================>

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

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

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    const newUser: User = {
      id: 0,
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    };

    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [newUser.username, newUser.email, newUser.password]
    );
    const { id: newUserId, username: newUsername } = newUser;
    const accessToken = Token.generateAccessToken(newUserId, newUsername);
    const refreshToken = Token.generateRefreshToken(newUserId);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    console.log('access token from createUser', accessToken);
    return next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

//EDIT USER CONTROLLER =====================================================================>

const editUser = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const { email, password, username } = req.body;

    const authenticatedUserId = (req.user as User).id;

    if (userId !== authenticatedUserId.toString()) {
      return res
        .status(403)
        .json({ error: 'Forbidden - You can only edit your own information' });
    }
    const isInvalid =
      (username && username.includes(' ')) ||
      (email && email.includes(' ')) ||
      (password && password.includes(' ')) ||
      (password && password.length < 8);

    const emailIsNotValid = email && !isValidEmailFormat(email);

    if (isInvalid) {
      {
        return res.status(400).json({
          error: 'Spaces are not allowed in username, email, or password',
        });
      }
    }

    if (emailIsNotValid) {
      {
        return res.status(400).json({
          error: 'email format is incorrect',
        });
      }
    }

    const [userToEditArray] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (userToEditArray.length < 1)
      return res.status(404).json({ error: 'User not found' });

    const updatedUserInfo: User = {
      id: Number(userId),
      username: username || userToEditArray[0].username,
      email: email || userToEditArray[0].email,
      password: password
        ? await bcrypt.hash(password.replace(/\s/g, ''), 10)
        : userToEditArray[0].password,
    };

    await pool.execute(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',

      [
        updatedUserInfo.username,
        updatedUserInfo.email,
        updatedUserInfo.password,
        updatedUserInfo.id,
      ]
    );
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to edit user' });
  }
};

//DELETE USER CONTROLLER ===================================================================>

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const [deleteUserArray] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    if (deleteUserArray.length < 1) {
      return res.status(404).json({ error: 'User not found' });
    }
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    return next();
  } catch (err) {
    return err;
  }
};

//controller to get all users ==================================================================>
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    res.locals.allUsers = rows;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Cannot find users' });
  }
};

//contoller to get user by ID =======================================================================>
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [
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

export const UserController = {
  createUser,
  getUserById,
  editUser,
  deleteUser,
  getAllUsers,
};
