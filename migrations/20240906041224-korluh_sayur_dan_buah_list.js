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
        await queryInterface.createTable('korluh_sayur_dan_buah_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            korluh_sayur_dan_buah_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'korluh_sayur_dan_buah',
                    key: 'id'
                }
            },
            korluh_master_sayur_dan_buah_id: {
                type: Sequelize.BIGINT,
            },

            hasil_produksi: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            luas_panen_habis: {
                type: Sequelize.DOUBLE,
            },
            luas_panen_belum_habis: {
                type: Sequelize.DOUBLE,
            },
            luas_rusak: {
                type: Sequelize.DOUBLE,
            },
            luas_penanaman_baru: {
                type: Sequelize.DOUBLE,
            },
            produksi_habis: {
                type: Sequelize.DOUBLE,
            },
            produksi_belum_habis: {
                type: Sequelize.DOUBLE,
            },
            rerata_harga: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('korluh_sayur_dan_buah_list');
    }
};
