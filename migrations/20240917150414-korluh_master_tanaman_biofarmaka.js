'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('korluh_master_tanaman_biofarmaka', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            nama: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addConstraint('korluh_tanaman_biofarmaka_list', {
            fields: ['korluh_master_tanaman_biofarmaka_id'],
            name: 'fk_master_tanaman_biofarmaka_id',
            type: 'foreign key',
            references: {
                table: 'korluh_master_tanaman_biofarmaka',
                field: 'id'
            }
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeConstraint('korluh_tanaman_biofarmaka_list', 'fk_master_tanaman_biofarmaka_id');

        await queryInterface.dropTable('korluh_master_tanaman_biofarmaka');
    }
};
