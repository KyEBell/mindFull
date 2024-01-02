import { Request, Response, NextFunction } from 'express';
import createPool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const validateUserInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    // Validation checks
    //if username, email or password are left blank
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    //password min length must be 8
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
    }
    //check email formatting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    //create DBpool
    const dbPool = await createPool();

    // Checking if userEmail already exists
    const [existingEmailRows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingEmailRows.length > 0) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }

    // Check if the username already exists
    const [existingUsernameRows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsernameRows.length > 0) {
      return res
        .status(400)
        .json({ error: 'User with this username already exists' });
    }
    //returning next back into controller
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
