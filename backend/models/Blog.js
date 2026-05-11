import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title:     { type: DataTypes.TEXT, allowNull: false },
    content:   { type: DataTypes.TEXT, allowNull: false },
    image_url: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'deleted'),
      allowNull: false,
      defaultValue: 'draft',
    },
    created_at:  { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    approved_at: { type: DataTypes.DATE, allowNull: true },
    approved_by: { type: DataTypes.UUID, allowNull: true },
    deleted_at:  { type: DataTypes.DATE, allowNull: true },
    deleted_by:  { type: DataTypes.UUID, allowNull: true },
  },
  {
    timestamps: false,
    tableName: 'blogs',
  }
)

Blog.belongsTo(User, { as: 'author', foreignKey: 'author_id' })
User.hasMany(Blog, { as: 'blogs', foreignKey: 'author_id' })

export default Blog
