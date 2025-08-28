import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET || 'supersecretjwtkey',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '7d',
};