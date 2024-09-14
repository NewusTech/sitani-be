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
        await queryInterface.createTable('validasi_korluh_padi', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            kecamatan_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'master_kecamatan',
                    key: 'id'
                }
            },
            bulan: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            status_tk_kecamatan: {
                type: Sequelize.ENUM('proses', 'tolak', 'terima'),
                defaultValue: 'proses',
                allowNull: false,
            },
            status_tk_kabupaten: {
                type: Sequelize.ENUM('proses', 'tolak', 'terima'),
                defaultValue: 'proses',
                allowNull: false,
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
        await queryInterface.dropTable('validasi_korluh_padi');
    }
};
