'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_roles', 
        'id',
      {
        type: Sequelize.INTEGER, 
        autoIncrement : true,
        unique: true,
        allowNull: false
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_roles','id')
  }
};
