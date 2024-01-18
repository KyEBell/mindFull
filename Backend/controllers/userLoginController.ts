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
    console.log('IN THE LOGIN CONTROLLER');
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: 'Username or email and password must be entered' });
    }

    let userRows: User[] = [];

    if (!identifier.includes('@')) {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [identifier]
      );
      if (isUserArray(rows)) {
        userRows = rows;
      }
    } else {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
        identifier,
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
    // console.log('USER ID FROM loginController', user.id);
    // console.log('username from login controller', user.username);
    const accessToken: string = Token.generateAccessToken(
      user.id,
      user.username
    );
    const refreshToken: string = Token.generateRefreshToken(user.id);

    res.locals.accessToken = accessToken;
    res.locals.refreshToken = refreshToken;

    console.log('Access token from userlogincontroller', accessToken);
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UserLoginController = { userLogin };
