import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mysql, { Pool } from 'mysql2/promise';

const createPool = async (): Promise<Pool> => {
  const pool: Pool = await mysql.createPool({
    host: process.env.DBH!,
    user: process.env.DBU!,
    password: process.env.DBP,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
};

const testConnection = async () => {
  try {
    const dbPool = await createPool();
    const connection = await dbPool.getConnection();
    console.log('connected to DaBa');
    connection.release();
  } catch (err) {
    console.log('unable to connect to db', err);
  }
};

testConnection();

export default createPool;
