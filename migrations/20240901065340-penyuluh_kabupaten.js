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
        await queryInterface.createTable('penyuluh_kabupaten', {
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
            nama: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nip: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            pangkat: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            golongan: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            keterangan: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('penyuluh_kabupaten');
    }
};
