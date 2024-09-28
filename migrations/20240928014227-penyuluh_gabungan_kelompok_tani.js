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
        await queryInterface.createTable('penyuluh_gabungan_kelompok_tani', {
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
            tahun: {
                type: Sequelize.INTEGER,
            },
            nama: {
                type: Sequelize.STRING,
            },
            ketua: {
                type: Sequelize.STRING,
            },
            sekretaris: {
                type: Sequelize.STRING,
            },
            bendahara: {
                type: Sequelize.STRING,
            },
            alamat: {
                type: Sequelize.STRING,
            },
            lahan: {
                type: Sequelize.DOUBLE,
            },
            dibentuk: {
                type: Sequelize.INTEGER,
            },
            poktan: {
                type: Sequelize.INTEGER,
            },
            l: {
                type: Sequelize.INTEGER,
            },
            p: {
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
        await queryInterface.dropTable('penyuluh_gabungan_kelompok_tani');
    }
};
