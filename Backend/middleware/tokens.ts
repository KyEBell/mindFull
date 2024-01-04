import { sign } from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const expiration = '1h';
const refresh_expiration = '7d';
const generateAccessToken = (id: number, username: string): string => {
  const key = process.env.KEY;

  if (!key) {
    throw new Error('KEY is not defined in the environment variables.');
  }

  return sign({ id, username }, key, {
    expiresIn: '1h',
  });
};

const generateRefreshToken = (id: number): string => {
  const refreshTokenKey = process.env.REFRESH_KEY;

  if (!refreshTokenKey) {
    throw new Error('REFRESH_KEY is not defined in the environment variables.');
  }

  return sign({ id }, refreshTokenKey, {
    expiresIn: '7d',
  });
};

export const Token = { generateAccessToken, generateRefreshToken };
