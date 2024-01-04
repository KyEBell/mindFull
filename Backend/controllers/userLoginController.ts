import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Token } from '../middleware/tokens';
import { User } from '../models/userModel';
import pool from '../config/db';

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  //helper function to confirm data is correct type
  function isUserArray(rows: any): rows is User[] {
    return (
      Array.isArray(rows) &&
      rows.length > 0 &&
      ('username' in rows[0] || 'email' in rows[0])
    );
  }
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ error: 'Username or email and password must be entered' });
    }

    let userRows: User[] = [];
    if (username) {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      if (isUserArray(rows)) {
        userRows = rows;
      }
    } else if (email) {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      if (isUserArray(rows)) {
        userRows = rows;
      }
    }

    const user = userRows[0];
    if (!user || !('password' in user)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = Token.generateAccessToken(user.id, user.username);
    const refreshToken = Token.generateRefreshToken(user.id);

    // res.cookie('accessToken', accessToken, { httpOnly: true });
    // res.cookie('refreshToken', refreshToken, { httpOnly: true });
    // console.log('Access token from userlogincontroller', accessToken);
    res.locals.accessToken = accessToken;
    res.locals.refreshToken = refreshToken;
    console.log(
      'res.locals.accessToken from userLoginController',
      res.locals.accessToken
    );
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UserLoginController = { userLogin };
