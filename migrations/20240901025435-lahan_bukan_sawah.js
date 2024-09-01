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
                type: Sequelize.INTEGER,
            },
            ladang: {
                type: Sequelize.INTEGER,
            },
            perkebunan: {
                type: Sequelize.INTEGER,
            },
            hutan_rakyat: {
                type: Sequelize.INTEGER,
            },
            padang_rumput: {
                type: Sequelize.INTEGER,
            },
            hutan_negara: {
                type: Sequelize.INTEGER,
            },
            smt_tidakdiusahakan: {
                type: Sequelize.INTEGER,
            },
            lainnya: {
                type: Sequelize.INTEGER,
            },
            jml_lahan_bukan_sawah: {
                type: Sequelize.INTEGER,
            },
            jalan_permukiman_perkantoran: {
                type: Sequelize.INTEGER,
            },
            total: {
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
        await queryInterface.dropTable('lahan_bukan_sawah');
    }
};
