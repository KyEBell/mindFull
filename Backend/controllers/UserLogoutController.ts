import { ExtendedRequest } from '../types';
import { Response, NextFunction } from 'express';

// Clear cookies

const userLogout = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  next();
};

export const UserLogoutController = { userLogout };
