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
        await queryInterface.createTable('kepang_perbandingan_harga_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            kepang_perbandingan_harga_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'kepang_perbandingan_harga',
                    key: 'id'
                }
            },
            kepang_master_komoditas_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'kepang_master_komoditas',
                    key: 'id'
                }
            },

            harga: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('kepang_perbandingan_harga_list');
    }
};
