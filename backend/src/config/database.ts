import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let dbAvailable = false;

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
    console.log('Database connection established');
    return true;
  } catch {
    dbAvailable = false;
    console.warn('Database unavailable — running in demo mode with in-memory data');
    return false;
  }
}

export function isDatabaseAvailable(): boolean {
  return dbAvailable;
}

export async function query(text: string, params?: unknown[]): Promise<QueryResult> {
  return pool.query(text, params);
}

export default pool;
