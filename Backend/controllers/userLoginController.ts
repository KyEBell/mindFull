import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createPool from '../config/db';

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Both username and password must be entered' });
    }
    const dbPool = await createPool();

    const [userRows] = await dbPool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userRows[0];
    if (!('password' in user)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'your-secret-key',
      {
        expiresIn: '1h',
      }
    );
    res.locals.token = token;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UserLoginController = { userLogin };
