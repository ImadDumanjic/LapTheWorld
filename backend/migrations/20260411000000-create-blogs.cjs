'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      status: {
        type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected', 'deleted'),
        allowNull: false,
        defaultValue: 'draft',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });

    await queryInterface.addIndex('blogs', ['author_id'], {
      name: 'blogs_author_id_idx',
    });

    await queryInterface.addIndex('blogs', ['status'], {
      name: 'blogs_status_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('blogs');

    // PostgreSQL retains ENUM types after the table is dropped.
    // This removes the type created for the status column.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_blogs_status";'
    );
  },
};
