import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Check your .env file.');
}

const isProduction = process.env.NODE_ENV === 'production';
const needsSSL = isProduction || /\.neon\.tech|sslmode=(require|verify-full|verify-ca)/i.test(databaseUrl);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: isProduction ? false : console.log,
  dialectOptions: needsSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
});

export default sequelize;