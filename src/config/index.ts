import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET || 'supersecretjwtkey',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '7d',
  pathao: {
    client_id: process.env.PATHAO_CLIENT_ID,
    client_secret: process.env.PATHAO_CLIENT_SECRET,
    username: process.env.PATHAO_USERNAME,
    password: process.env.PATHAO_PASSWORD,
    environment: process.env.PATHAO_ENVIRONMENT || 'sandbox',
    api_base_url: process.env.PATHAO_ENVIRONMENT === 'production' 
      ? 'https://api-hermes.pathao.com' 
      : 'https://courier-api-sandbox.pathao.com',
  },
};