import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { isValidEmailFormat } from '../utils/isValidEmail';
import { Token } from '../middleware/tokens';
import { ExtendedRequest } from '../types';
//=======================Creating a user controller ==============================================>

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    // console.log('made it to the create user controller function');
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
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    };

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [newUser.username, newUser.email, newUser.password]
    );
    if (result.insertId) {
      const newUserId = result.insertId; // Use the inserted id
      const { username: newUsername, email: newEmail } = newUser;
      const accessToken = Token.generateAccessToken(
        newUserId,
        newUsername,
        newEmail
      );
      const refreshToken = Token.generateRefreshToken(newUserId);
      res.locals.accessToken = accessToken;
      res.locals.refreshToken = refreshToken;
      console.log('refresh token from createUser', refreshToken);
      console.log('access token from user controller', accessToken);
      return next();
    } else {
      return res.status(500).json({ error: 'Failed to create user' });
    }
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

    const authenticatedUser = req.user as User;

    if (!authenticatedUser || authenticatedUser.id === undefined) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - user not logged in' });
    }

    const authenticatedUserId = authenticatedUser.id;

    if (userId !== authenticatedUserId.toString()) {
      return res
        .status(403)
        .json({ error: 'Forbidden - user to edit must be logged in' });
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
    console.log('in the delete user backend controller');
    const userId = req.params.id;
    const [deleteUserArray] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (deleteUserArray.length < 1) {
      console.log('delete user NOT WORKING');
      return res.status(404).json({ error: 'User not found' });
    }

    const [journalEntries] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM journal_entries WHERE user_id = ?',
      [userId]
    );

    if (journalEntries.length > 0) {
      // Deleting related journal entries for the user, then deleting user afterwards.
      await pool.execute('DELETE FROM journal_entries WHERE user_id = ?', [
        userId,
      ]);
    }
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    console.log('delete user should be working? ');

    return next();
  } catch (err) {
    console.error(err);
    return next(err);
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
