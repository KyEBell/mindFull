import { sign } from 'jsonwebtoken';

const expiration = '1h';
const refresh_expiration = '7d';
const generateAccessToken = (id: number, username: string): string => {
  const key = process.env.KEY;

  if (!key) {
    throw new Error('KEY is not defined in the environment variables.');
  }

  return sign({ id, username }, key, {
    expiresIn: expiration,
  });
};

const generateRefreshToken = (id: number): string => {
  const refreshTokenKey = process.env.REFRESH_KEY;

  if (!refreshTokenKey) {
    throw new Error('REFRESH_KEY is not defined in the environment variables.');
  }

  return sign({ id }, refreshTokenKey, {
    expiresIn: refresh_expiration,
  });
};

export const Token = { generateAccessToken, generateRefreshToken };
