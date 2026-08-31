'use strict';

/*
* Migration script that creates the "Categories" table in the database.
* Columns: id (INT), name (VARCHAR), createdAt (DATETIME), updatedAt(DATETIME).
*/

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Categories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Categories');
  },
};