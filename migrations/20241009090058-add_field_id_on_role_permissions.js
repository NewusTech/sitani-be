'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('role_permissions', 
        'id',
      {
        type: Sequelize.INTEGER, 
        autoIncrement : true,
        primaryKey: true,
        allowNull: false
      }
    );

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('role_permissions','id')
  }
};
