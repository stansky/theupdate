import { defineAuth, secret } from '@aws-amplify/backend';

import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: secret(MYSQL_HOST),
    user: secret(MYSQL_USER),
    password: secret(MYSQL_PASSWORD),
    database: secret(MYSQL_DB_NAME)
  });

  const query = `
    SELECT * FROM emails 
    WHERE DATE(CONVERT_TZ(date_received, '+00:00', '-08:00')) 
    BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
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
