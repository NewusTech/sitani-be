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
        await queryInterface.createTable('tph_lahan_bukan_sawah_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            tph_lahan_bukan_sawah_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'tph_lahan_bukan_sawah',
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
            padang_pengembalaan_rumput: {
                type: Sequelize.DOUBLE,
            },
            hutan_negara: {
                type: Sequelize.DOUBLE,
            },
            smt_tidak_diusahakan: {
                type: Sequelize.DOUBLE,
            },
            lainnya: {
                type: Sequelize.DOUBLE,
            },
            jumlah_lahan_bukan_sawah: {
                type: Sequelize.DOUBLE,
            },
            lahan_bukan_pertanian: {
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
        await queryInterface.dropTable('tph_lahan_bukan_sawah_list');
    }
};
