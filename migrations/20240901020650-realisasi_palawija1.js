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
        await queryInterface.createTable('realisasi_palawija1', {
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
            desa_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'master_desa',
                    key: 'id'
                }
            },
            panen_kacang_hijau: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_kacang_hijau: {
                type: Sequelize.DOUBLE,
            },
            produksi_kacang_hijau: {
                type: Sequelize.DOUBLE,
            },
            panen_ubi_kayu: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_ubi_kayu: {
                type: Sequelize.DOUBLE,
            },
            produksi_ubi_kayu: {
                type: Sequelize.DOUBLE,
            },
            panen_ubi_jalar: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_ubi_jalar: {
                type: Sequelize.DOUBLE,
            },
            produksi_ubi_jalar: {
                type: Sequelize.DOUBLE,
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
        await queryInterface.dropTable('realisasi_palawija1');
    }
};
