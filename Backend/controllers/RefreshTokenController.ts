import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../types';
import { Token } from '../middleware/tokens';
import { RefreshTokenPayload, AccessTokenPayload } from '../middleware/tokens';

const refresh = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized - Refresh token missing' });
      return Promise.resolve();
    }

    let decodedToken: AccessTokenPayload | RefreshTokenPayload;

    try {
      // Try decoding as access token payload
      decodedToken = Token.verifyRefreshToken(refreshToken);
    } catch (error) {
      // If decoding as access token fails, try decoding as refresh token payload
      decodedToken = Token.verifyRefreshToken(refreshToken, true);
    }

    if ('username' in decodedToken) {
      // This is an access token, and it has a username property
      const newAccessToken = Token.generateAccessToken(
        decodedToken.id,
        decodedToken.username,
        decodedToken.email
      );
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
    }
    return next();
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid Refresh Token' });
    return Promise.resolve();
  }
};

export const RefreshTokenController = { refresh };
