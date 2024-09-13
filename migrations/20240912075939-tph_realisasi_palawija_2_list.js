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
        await queryInterface.createTable('tph_realisasi_palawija_2_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            tph_realisasi_palawija_2_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'tph_realisasi_palawija_2',
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

            kacang_hijau_panen: {
                type: Sequelize.DOUBLE,
            },
            kacang_hijau_produktivitas: {
                type: Sequelize.DOUBLE,
            },
            kacang_hijau_produksi: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_produktivitas: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_produksi: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_produktivitas: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_produksi: {
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
        await queryInterface.dropTable('tph_realisasi_palawija_2_list');
    }
};
