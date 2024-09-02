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
        await queryInterface.createTable('realisasi_palawija2', {
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
            panen_jagung: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_jagung: {
                type: Sequelize.DOUBLE,
            },
            produksi_jagung: {
                type: Sequelize.DOUBLE,
            },
            panen_kedelai: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_kedelai: {
                type: Sequelize.DOUBLE,
            },
            produksi_kedelai: {
                type: Sequelize.DOUBLE,
            },
            panen_kacang_tanah: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_kacang_tanah: {
                type: Sequelize.DOUBLE,
            },
            produksi_kacang_tanah: {
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
        await queryInterface.dropTable('realisasi_palawija2');
    }
};
