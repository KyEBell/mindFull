import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../types';
import { Token } from '../middleware/tokens';

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
    const decodedToken = Token.verifyRefreshToken(refreshToken);
    const newAccessToken = Token.generateAccessToken(
      decodedToken.id,
      decodedToken.username
    );
    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    return next();
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid Refresh Token' });
    return Promise.resolve();
  }
};

export const RefreshTokenController = { refresh };
