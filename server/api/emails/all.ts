import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;

  console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
  console.log('MYSQL_USER:', process.env.MYSQL_USER);
  console.log('MYSQL_DB_NAME:', process.env.MYSQL_DB_NAME);

  // Create MySQL connection
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB_NAME
  });

  // Query to get all emails without any time filter
  const query = `SELECT * FROM emails`;

  try {
    const [rows] = await connection.execute(query);
    return rows; // Return all the emails
  } catch (error) {
    console.error('Database query failed:', error);
    return { error: 'Database query failed' };
  } finally {
    await connection.end();
  }
});
