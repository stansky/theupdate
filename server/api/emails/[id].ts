import { defineAuth, secret } from '@aws-amplify/backend';

import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

// Function to clean HTML by removing <head> and <img> tags
function cleanEmailBody(body: string): string {
  // Remove <head> tag and its contents
  body = body.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')

  // Remove all <img> tags
  body = body.replace(/<img[^>]*>/gi, '')

  return body;
}

export default defineEventHandler(async (event) => {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;
  const params = event.context.params;

  if (!params || !params.id) {
    return { error: 'Invalid request: Missing email ID' };
  }
  
  const { id } = params; // Get the email ID from the URL params
  const connection = await mysql.createConnection({
    host: await secret('MYSQL_HOST').toString(),
    user: await secret('MYSQL_USER').toString(),
    password: await secret('MYSQL_PASSWORD').toString(),
    database: await secret('MYSQL_DB_NAME').toString()
  });

  // Query to fetch the email by ID
  const query = `SELECT * FROM emails WHERE id = ?`;
  
  try {
    const [rows]: [any[], any] = await connection.execute(query, [id]);
    if (rows.length === 0) {
      return { error: 'Email not found' };
    }

    // Clean the email body before returning
    const email = rows[0];
    email.body = cleanEmailBody(email.body);  // Clean the body HTML
    
    return email; 
  } catch (error) {
    console.error('Database query failed:', error);
    return { error: 'Database query failed' };
  } finally {
    await connection.end();
  }
});
