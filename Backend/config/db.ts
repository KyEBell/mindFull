import dotenv from 'dotenv';
import path from 'path';
import mysql, { Pool } from 'mysql2/promise';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool: Pool = mysql.createPool({
  host: process.env.DBH!,
  user: process.env.DBU!,
  password: process.env.DBP,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('connected to DaBa');
    connection.release();
  } catch (err) {
    console.log('unable to connect to db', err);
  }
};

testConnection();

export default pool;
