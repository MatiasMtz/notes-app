'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Categories', 'color', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '#FFFFFF',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Categories', 'color');
  },
};
