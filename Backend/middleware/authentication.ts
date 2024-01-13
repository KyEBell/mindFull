import {
  verify,
  JsonWebTokenError,
  TokenExpiredError,
  decode,
} from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { Token } from './tokens';
import { User } from '../models/userModel';

interface ExpressRequest extends Request {
  user?: User;
}

const authenticateToken = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];
  // console.log(req.headers);
  console.log('access token from authenticate token', accessToken);
  if (!accessToken) {
    res.status(401).json({ error: 'Unauthorized - Access Token missing' });
    return;
  }

  try {
    // const decodedTokenBeforeVerification = decode(accessToken);
    // console.log(
    //   'Decoded Token Before Verification:',
    //   decodedTokenBeforeVerification
    // );
    const decodedToken = verify(accessToken, process.env.KEY!);
    const expirationTime = (decodedToken as any).exp * 1000;
    const currentTime = new Date().getTime();
    const timeToExpiration = expirationTime - currentTime;
    if (timeToExpiration < 300 * 1000) {
      console.log(
        'EXPIRATION TIME IS TOO SHORT NEED NEW ACCESS TOKEN',
        timeToExpiration
      );

      const newAccessToken = Token.generateAccessToken(
        (decodedToken as any).id,
        (decodedToken as any).username
      );
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      // res.locals.accessToken = newAccessToken;
      console.log(
        'new access token being created from token expiration check function in authentication.ts'
      );
    }
    req.user = decodedToken as User;

    return next();
  } catch (error) {
    console.error(
      'Token Verification Error from authentication.ts',
      (error as any).expiredAt
    );

    if (error instanceof TokenExpiredError) {
      console.error('Token Verification Error', error);
      res.status(401).json({
        error: 'Unauthorized - Invalid Access Token',
      });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
    return;
  }
};

export { authenticateToken };
