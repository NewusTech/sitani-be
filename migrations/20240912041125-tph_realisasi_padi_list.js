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
        await queryInterface.createTable('tph_realisasi_padi_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            tph_realisasi_padi_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'tph_realisasi_padi',
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

            panen_lahan_sawah: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_lahan_sawah: {
                type: Sequelize.DOUBLE,
            },
            produksi_lahan_sawah: {
                type: Sequelize.DOUBLE,
            },
            panen_lahan_kering: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_lahan_kering: {
                type: Sequelize.DOUBLE,
            },
            produksi_lahan_kering: {
                type: Sequelize.DOUBLE,
            },
            panen_total: {
                type: Sequelize.DOUBLE,
            },
            produktivitas_total: {
                type: Sequelize.DOUBLE,
            },
            produksi_total: {
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
        await queryInterface.dropTable('tph_realisasi_padi_list');
    }
};
