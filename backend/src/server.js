import dotenv from 'dotenv';
import app from './app.js';
import sequelize from '../config/database.js';
import { runMigrations } from './db/migrate.js';
import { connect as connectF1 } from './services/f1LiveTimingService.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Database connection established.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      connectF1();
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
  }
}

initializeDatabase();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});
