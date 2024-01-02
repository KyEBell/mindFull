import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
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
    const uname = username.trim();
    const pass = password.trim();
    const mail = email.trim();
    if (!uname || !mail || !pass) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    //password min length must be 8
    if (pass.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
    }
    //check email formatting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    //create DBpool
    // const dbPool = await createPool();

    // Checking if userEmail already exists
    const [existingEmailRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [mail]
    );

    if (existingEmailRows.length > 0) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }

    // Check if the username already exists
    const [existingUsernameRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [uname]
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
