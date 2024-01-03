import { verify, JsonWebTokenError } from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import path from 'path';
import { Request, Response, NextFunction } from 'express';

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface ExpressRequest extends Request {
  user?: import('../models/userModel').User;
}

const authenticateToken = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    res.status(401).json({ error: 'Unauthorized - Access Token missing' });
    return;
  }
  try {
    const decodedToken = verify(accessToken, process.env.KEY!);
    req.user = decodedToken as import('../models/userModel').User;
    return next();
  } catch (error) {
    console.error(error);

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ error: 'Unauthorized - Invalid Access Token' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return;
  }
};

export { authenticateToken };
