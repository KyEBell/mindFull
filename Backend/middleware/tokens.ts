import { sign, verify, Secret } from 'jsonwebtoken';

export interface AccessTokenPayload {
  id: number;
  username: string;
  email: string;
}

export interface RefreshTokenPayload {
  id: number;
}

const expiration = '1h';
const refresh_expiration = '3d';
const generateAccessToken = (
  id: number,
  username: string,
  email: string
): string => {
  const key = process.env.KEY as Secret;

  if (!key) {
    throw new Error('KEY is not defined in the environment variables.');
  }

  return sign({ id, username, email }, key, {
    expiresIn: expiration,
  });
};

const generateRefreshToken = (id: number): string => {
  const refreshTokenKey = process.env.REFRESH_KEY as Secret;

  if (!refreshTokenKey) {
    throw new Error('REFRESH_KEY is not defined in the environment variables.');
  }

  return sign({ id }, refreshTokenKey, {
    expiresIn: refresh_expiration,
  });
};

const verifyRefreshToken = (
  token: string,
  isAccessToken?: boolean
): AccessTokenPayload | RefreshTokenPayload => {
  const refreshTokenKey = process.env.REFRESH_KEY as Secret;

  if (!refreshTokenKey) {
    throw new Error('REFRESH_KEY is not defined in the environment variables.');
  }
  try {
    return verify(token, refreshTokenKey) as
      | AccessTokenPayload
      | RefreshTokenPayload;
  } catch (error) {
    if (isAccessToken) {
      throw new Error('Invalid Access Token');
    } else {
      throw new Error('Invalid Refresh Token');
    }
  }
};

export const Token = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
