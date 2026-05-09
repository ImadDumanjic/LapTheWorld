import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Guide = sequelize.define(
  'Guide',
  {
    slug:             { type: DataTypes.STRING(64), primaryKey: true },
    title:            { type: DataTypes.TEXT, allowNull: false },
    country:          { type: DataTypes.TEXT, allowNull: false },
    city:             { type: DataTypes.TEXT, allowNull: false },
    circuit:          { type: DataTypes.TEXT, allowNull: false },
    lat:              { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    lng:              { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    weather_location: { type: DataTypes.TEXT, allowNull: false },
    circuit_info:     { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    guide_sections:   { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    hotels:           { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  },
  {
    timestamps: false,
    tableName: 'guides',
  }
)

export default Guide
