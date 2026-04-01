import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username:  { type: DataTypes.STRING, allowNull: false, unique: true },
  email:     { type: DataTypes.STRING, allowNull: false, unique: true },
  password:  { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING },
  lastName:  { type: DataTypes.STRING },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    allowNull: false,
    defaultValue: 'User',
  },

  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  resetPasswordTokenHash: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, { timestamps: true, tableName: 'users' })

export default User
