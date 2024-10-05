import { defineAuth, secret } from '@aws-amplify/backend';

import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;

  // Create MySQL connection
  const connection = await mysql.createConnection({
    host: await secret('MYSQL_HOST').toString(),
    user: await secret('MYSQL_USER').toString(),
    password: await secret('MYSQL_PASSWORD').toString(),
    database: await secret('MYSQL_DB_NAME').toString()
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
