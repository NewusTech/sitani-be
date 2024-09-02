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
        await queryInterface.createTable('penyuluh_kabupaten_desabinaan', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            penyuluh_kabupaten_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'penyuluh_kabupaten',
                    key: 'id'
                }
            },
            kecamatan_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'master_kecamatan',
                    key: 'id'
                }
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
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('penyuluh_kabupaten_desabinaan');
    }
};
