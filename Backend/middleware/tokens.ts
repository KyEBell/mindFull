import { sign } from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const generateAccessToken = (userId: number, username: string): string => {
  const key = process.env.KEY;

  if (!key) {
    throw new Error('KEY is not defined in the environment variables.');
  }

  return sign({ userId, username }, key, {
    expiresIn: '1h',
  });
};

const generateRefreshToken = (userId: number): string => {
  const refreshTokenKey = process.env.REFRESH_KEY;

  if (!refreshTokenKey) {
    throw new Error('REFRESH_KEY is not defined in the environment variables.');
  }

  return sign({ userId }, refreshTokenKey);
};

export const TokenFunction = { generateAccessToken, generateRefreshToken };
