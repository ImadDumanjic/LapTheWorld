import dotenv from 'dotenv';
import app from './app.js';
import sequelize from '../config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
  }
}

initializeDatabase();
