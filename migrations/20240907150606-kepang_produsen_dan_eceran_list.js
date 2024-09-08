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
        await queryInterface.createTable('kepang_produsen_dan_eceran_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            kepang_produsen_dan_eceran_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'kepang_produsen_dan_eceran',
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

            satuan: {
                type: Sequelize.STRING,
            },
            harga: {
                type: Sequelize.INTEGER,
            },
            keterangan: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('kepang_produsen_dan_eceran_list');
    }
};
