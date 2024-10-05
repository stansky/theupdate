import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB_NAME
  });

  const query = `
    SELECT * FROM emails 
    WHERE DATE(CONVERT_TZ(date_received, '+00:00', '-08:00')) 
    BETWEEN CURDATE() - INTERVAL 7 DAY AND CURDATE() 
    LIMIT 20
  `;

  try {
    const [rows] = await connection.execute(query);
    return rows;
  } catch (error) {
    console.error('Database query failed:', error);
    return { error: 'Database query failed' };
  } finally {
    await connection.end();
  }
});
