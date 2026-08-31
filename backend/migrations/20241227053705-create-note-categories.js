'use strict';

/*
* Creates the "NoteCategories" table in the database.
* It establishes a many-to-many relationship between Notes and Categories tables.
* The table includes foreign keys referencing Notes and Categories.
* Columns: noteId (INT), CategoryID (INT), createdAT (DATETIME), updatedAT (DATETIME).
*/

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NoteCategories', {
      noteId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Notes', // Reference to the Notes table
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories', // Reference to the Categories table
          key: 'id', 
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NoteCategories'); // Removes the "NoteCategories" table
  },
};