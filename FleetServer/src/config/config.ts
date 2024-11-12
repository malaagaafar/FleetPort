import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  geotab: {
    username: process.env.GEOTAB_USERNAME,
    password: process.env.GEOTAB_PASSWORD,
    database: process.env.GEOTAB_DATABASE,
    server: process.env.GEOTAB_SERVER
  }
};