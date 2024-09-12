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
        await queryInterface.createTable('tph_realisasi_palawija_1_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            tph_realisasi_palawija_1_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'tph_realisasi_palawija_1',
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

            jagung_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_produktivitas: {
                type: Sequelize.DOUBLE,
            },
            jagung_produksi: {
                type: Sequelize.DOUBLE,
            },
            kedelai_panen: {
                type: Sequelize.DOUBLE,
            },
            kedelai_produktivitas: {
                type: Sequelize.DOUBLE,
            },
            kedelai_produksi: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_panen: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_produktivitas: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_produksi: {
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
        await queryInterface.dropTable('tph_realisasi_palawija_1_list');
    }
};
