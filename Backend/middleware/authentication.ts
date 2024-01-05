import {
  verify,
  JsonWebTokenError,
  TokenExpiredError,
  decode,
} from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { Token } from './tokens';

interface ExpressRequest extends Request {
  user?: import('../models/userModel').User;
}

const authenticateToken = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.headers.authorization?.split(' ')[1];
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
    console.log('EXPIRATION TIME', timeToExpiration);
    if (timeToExpiration < 300 * 1000) {
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
    req.user = decodedToken as import('../models/userModel').User;

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
