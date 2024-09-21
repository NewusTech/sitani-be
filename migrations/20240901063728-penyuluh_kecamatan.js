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
        await queryInterface.createTable('penyuluh_kecamatan', {
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
                type: Sequelize.STRING(20),
            },
            pangkat: {
                type: Sequelize.STRING,
            },
            golongan: {
                type: Sequelize.STRING,
            },
            keterangan: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('penyuluh_kecamatan');
    }
};
