import { verify, TokenExpiredError } from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { Token } from './tokens';
import { User } from '../models/userModel';

interface ExpressRequest extends Request {
  user?: User;
}

const checkAuthentication = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];

  if (!accessToken) {
    res.status(401).json({ isAuthenticated: false });
    return;
  }

  try {
    const decodedToken = verify(accessToken, process.env.KEY!);
    const expirationTime = (decodedToken as any).exp * 1000;
    const currentTime = new Date().getTime();
    const timeToExpiration = expirationTime - currentTime;

    if (timeToExpiration < 300 * 1000) {
      const newAccessToken = Token.generateAccessToken(
        (decodedToken as any).id,
        (decodedToken as any).username
      );
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
    }

    req.user = decodedToken as User;
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ isAuthenticated: false });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export { checkAuthentication };
