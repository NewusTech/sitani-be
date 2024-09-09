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
        await queryInterface.createTable('kepang_cv_produksi', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            bulan: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            panen: {
                type: Sequelize.DOUBLE,
            },
            gkp_tk_petani: {
                type: Sequelize.INTEGER,
            },
            gkp_tk_penggilingan: {
                type: Sequelize.INTEGER,
            },
            jpk: {
                type: Sequelize.INTEGER,
            },
            cabai_merah_keriting: {
                type: Sequelize.INTEGER,
            },
            beras_medium: {
                type: Sequelize.INTEGER,
            },
            beras_premium: {
                type: Sequelize.INTEGER,
            },
            stok_gkg: {
                type: Sequelize.INTEGER,
            },
            stok_beras: {
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
        await queryInterface.dropTable('kepang_cv_produksi');
    }
};
