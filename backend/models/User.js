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
}, { timestamps: true, tableName: 'users' })

export default User
