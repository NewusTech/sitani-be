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
        await queryInterface.createTable('lahan_bukan_sawah', {
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
            tegal: {
                type: Sequelize.DOUBLE,
            },
            ladang: {
                type: Sequelize.DOUBLE,
            },
            perkebunan: {
                type: Sequelize.DOUBLE,
            },
            hutan_rakyat: {
                type: Sequelize.DOUBLE,
            },
            padang_rumput: {
                type: Sequelize.DOUBLE,
            },
            hutan_negara: {
                type: Sequelize.DOUBLE,
            },
            smt_tidakdiusahakan: {
                type: Sequelize.DOUBLE,
            },
            lainnya: {
                type: Sequelize.DOUBLE,
            },
            jml_lahan_bukan_sawah: {
                type: Sequelize.DOUBLE,
            },
            jalan_permukiman_perkantoran: {
                type: Sequelize.DOUBLE,
            },
            total: {
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
        await queryInterface.dropTable('lahan_bukan_sawah');
    }
};
