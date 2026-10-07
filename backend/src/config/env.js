import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
