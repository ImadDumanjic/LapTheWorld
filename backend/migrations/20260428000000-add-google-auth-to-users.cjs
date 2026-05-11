'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_users_auth_provider" AS ENUM ('password', 'google');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.addColumn('users', 'auth_provider', {
      type: '"enum_users_auth_provider"',
      allowNull: false,
      defaultValue: 'password',
    });
    await queryInterface.addColumn('users', 'google_sub', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'google_sub');
    await queryInterface.removeColumn('users', 'auth_provider');
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
