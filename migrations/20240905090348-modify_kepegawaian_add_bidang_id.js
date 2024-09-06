'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn(
      'master_kepegawaian', // table name
      'bidang_id', // new field name
      {
        type: Sequelize.BIGINT,
        allowNull: false,
        references : {
          model : 'master_bidang',
          key : 'id'
        }
      },
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'master_kepegawaian',
      'bidang_id'
    )
  }
};
