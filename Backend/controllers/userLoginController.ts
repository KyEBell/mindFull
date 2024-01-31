import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Token } from '../middleware/tokens';
import { User } from '../models/userModel';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: 'Username or email and password must be entered' });
    }

    let userRows: RowDataPacket[];

    if (!identifier.includes('@')) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE username = ?',
        [identifier]
      );
      userRows = rows;
    } else {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [identifier]
      );
      userRows = rows;
    }
    const user = userRows[0] as User | undefined;
    if (!user || user.id === undefined || !('password' in user)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken: string = Token.generateAccessToken(
      user.id,
      user.username
    );
    const refreshToken: string = Token.generateRefreshToken(user.id);

    res.locals.accessToken = accessToken;
    res.locals.refreshToken = refreshToken;
    res.locals.user = {
      id: user.id,
      username: user.username,
    };

    console.log('Access token from userlogincontroller', accessToken);
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UserLoginController = { userLogin };
