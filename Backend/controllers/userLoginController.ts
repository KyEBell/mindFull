import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import createPool from '../config/db';
import { TokenFunction } from '../middleware/tokens';

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ error: 'Username or email and password must be entered' });
    }
    const dbPool = await createPool();

    let userRows;
    if (username) {
      [userRows] = await dbPool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
    } else if (email) {
      [userRows] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
    }
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

    const accessToken = TokenFunction.generateAccessToken(
      user.id,
      user.username
    );
    const refreshToken = TokenFunction.generateRefreshToken(user.id);

    res.locals.accessToken = accessToken;
    res.locals.refreshToken = refreshToken;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UserLoginController = { userLogin };
