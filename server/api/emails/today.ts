import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  // Load environment variables
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;

  // Create MySQL connection
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB_NAME
  });

  // Query to get today's emails (UTC converted to PST)
  const query = `
    SELECT id, sender, subject, date_received FROM emails 
    WHERE DATE(CONVERT_TZ(date_received, '+00:00', '-08:00')) = CURDATE()
  `;

  try {
    const [rows] = await connection.execute(query);
    return rows; // Return the result of the query
  } catch (error) {
    console.error('Database query failed:', error);
    return { error: 'Database query failed' };
  } finally {
    await connection.end();
  }
});
